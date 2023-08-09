import getTransactionItemList, { moneyRegex } from '~/util/getList'
import { getInventory, unmeasured } from '~/util/getInventory'
import { clean } from '~/util/getDifferences'

export function getPercentageColor(percentage) {
  if (percentage < 30) return 'rgb(255, 45, 85)'
  if (percentage < 50) return 'rgb(255, 149, 0)'
  if (percentage < 80) return 'rgb(255, 204, 0)'
  return 'rgb(52, 199, 89)'
}

const allVariations = {}

function getVariations({ name, measurementUnit, $store }) {
  const key = `${name}-${measurementUnit}`
  if (allVariations[key]) return allVariations[key]

  const transactions = $store.state.user.data.transactions

  const lists = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((tr) =>
      getTransactionItemList(
        tr.description,
        {
          removeEuroString: true,
          forceList: true,
        },
        tr
      )
    )

  const variationsList = {}

  for (const list of lists) {
    const store = list.find((e) => e.cents === 0)?.description
    for (const product of list) {
      if (
        (product.weight?.measurement || 'unmeasured') === measurementUnit &&
        clean(product.description) === clean(name)
      ) {
        const originalWithoutMoney = product.original
          .replace(new RegExp(moneyRegex, 'gi'), '')
          .trim()

        const key = `${store} ${originalWithoutMoney}`
        if (!variationsList[key]) {
          variationsList[key] = {
            ...product,
            store,
            originalWithoutMoney,
          }
        }
      }
    }
  }

  const variations = Object.values(variationsList)
    .sort((a, b) => a.cents - b.cents)
    .sort((a, b) => a.weight?.value - b.weight?.value)
  if (variations.length > 0) allVariations[key] = variations
  return variations
}

export function getBestProductPriceOption({
  name,
  measurementUnit,
  $store,
  minAmount,
}) {
  if (minAmount === 0) return

  const variations = getVariations({
    name,
    measurementUnit,
    $store,
    minAmount,
  }).filter((opt) => {
    return (
      (measurementUnit === 'unmeasured' ? opt.itemCount : opt.weight.value) >=
      minAmount
    )
  })
  return variations[0]
}

export function getRecipeInfo(recipe, $store) {
  const ingredients = getTransactionItemList(recipe.ingredients, {
    removeCount: true,
    removeEuroString: true,
    removeMeasurements: true,
    forceList: true,
  })

  // Find missing ingredients

  // Find the products the user is lacking after `requirementsAsList`
  const inventory = getInventory($store)

  //
  const requirements = []
  for (const product of ingredients) {
    const name = clean(product.description)
    const measurementUnit = product?.weight?.measurement ?? unmeasured

    const productOptions = Object.entries(inventory)
      .filter(([n]) =>
        product.isAny ? n.includes(clean(name)) : clean(n) === clean(name)
      )
      .map((t) => t[1])

    const inStockCount = productOptions.reduce(
      (acc, current) => acc + (current?.weights[measurementUnit]?.count || 0),
      0
    )
    const requiredCount = product?.weight?.totalValue ?? product.itemCount

    const missing = Math.max(requiredCount - inStockCount, 0)

    const cheapestOptionForMissing = getBestProductPriceOption({
      name,
      measurementUnit,
      $store,
      minAmount: missing,
    })

    const cheapestOption = getBestProductPriceOption({
      name,
      measurementUnit,
      $store,
      minAmount: requiredCount,
    })

    requirements.push({
      measurementUnit,
      description: product.description,
      requiredTotal: requiredCount,
      inStock: inStockCount,
      missing,
      cheapestOption,
      cheapestOptionForMissing,
      isAny: product.isAny,
    })
  }

  // Calculate total required ingredients percentage
  const totalRequirements = requirements.length
  let requirementsInStock = 0
  for (const requirement of requirements) {
    requirementsInStock += Math.min(
      requirement.inStock / requirement.requiredTotal,
      1
    )
  }
  const requirementsPossesedPercentage = Math.round(
    (requirementsInStock / totalRequirements) * 100
  )

  const data = {
    ingredients,
    requirements: requirements.sort(
      (a, b) => a.inStock / a.requiredTotal - b.inStock / b.requiredTotal
    ),
    approximatePriceInCents: requirements.reduce(
      (a, b) => a + (b.cheapestOption?.cents || 0),
      0
    ),
    approximateMissingItemsPriceInCents: requirements.reduce(
      (a, b) => a + (b.cheapestOptionForMissing?.cents || 0),
      0
    ),
    requirementsPossesedPercentage,
  }

  return data
}
