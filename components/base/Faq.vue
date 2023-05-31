<template>
  <div>
    <collapsible title="Can I automatically import my transactions?">
      <p>
        No. The app is not designed to automatically import your transactions.
        This was done for a reason: specificity. Bank transactions almost never
        tell you what you actually spent money on, and only tells you the store
        or brand.
      </p>
      <p>
        By adding everything yourself, you can be descriptive and precise. By
        using the format the app optionally lets you to use, it can help you
        analyse your purchases by showing price trends.
      </p>
    </collapsible>
    <collapsible title="How can I make full use of the app's features?">
      <p>
        The app allows you to make "lists" with prices and quantities that can
        then be parsed by other pages inside the app.
      </p>
      <p>
        For example, if you put the store and the price for each items, it can
        show the price of that item over time on the "prices" page.
      </p>
      <p>
        Inputting the following in your transaction description will produce the
        card shown after that.
      </p>
      <code>
        My Local store<br />
        Item one €5.50<br />
        2x Item two €11<br />
        Item three x 5 €11
      </code>
      <payment-card :payment="examplePayment" disable-actions />
    </collapsible>
    <collapsible title="How do the dates work?">
      <p>
        The way I see it, the app works with "periods". These start on the 23rd
        of each month, and end 22nd of the next.
      </p>
      <p>
        The 23rd is a remnant from when I was paid on that date. I no longer get
        paid then, but assigning all your payments to a single day in the month
        (especially if you're not paid monthly) helps massively with
        orginisation.
      </p>
      <p>
        Note that while I see the app as using periods, you can set any "start"
        and "end" date manually inside the app.
      </p>
      <p>
        I will likely make it possible to change the default date away from the
        23rd at some point, but I don't know when.
      </p>
    </collapsible>
    <collapsible title="How do the categories work?">
      <p>You can manually add a list of categories and divide by a comma.</p>
      <p>
        There are various utility categories you can use to make the app behave
        a certain way, namely:
      </p>
      <ul>
        <li>
          <strong>"food" or "eten"</strong>: puts your transaction in a seperate
          tab in the "period" section at the very top (or left) of the app. This
          way you can budget your food each period.
        </li>
        <li>
          <strong>"adjust food" or "eten aanpassen"</strong>: moves some money
          from the food budget into the regular budget, or the other way around.
        </li>
        <li>
          <strong>"exclude"</strong>: exclude transaction from period total,
          overview, the prices page, etc.
        </li>
        <li>
          <strong>"exclude pricing"</strong>: using "exclude" does not keep the
          transaction from being counted for a store's pricing of an item. This
          tag does.
        </li>
        <li>
          <strong>"monthly" or "maandelijks"</strong>: this will take the
          current date (say, the 22nd) and create a countdown to that date next
          month in the "recurring" tab, like so:
          <payment-card :payment="recurringPayment" disable-actions />
        </li>
        <li>
          <strong>"quarterly" or "driemaandelijks"</strong>: show on recurring
          page, 3 months from now
        </li>
        <li>
          <strong>"yearly" or "jaarlijks"</strong>: show on recurring page, this
          date next year
        </li>
        <li>
          <!-- eslint-disable-next-line no-irregular-whitespace -->
          <strong>"stock"</strong>: add items in payment to inventory — see
          question below.
        </li>
      </ul>
    </collapsible>
    <collapsible title="How can I make use of the inventory?">
      <p>
        If you add the "stock" category to your transaction, it will take every
        item from that transaction and place it in the inventory. If you include
        a measurement in the item line, it will add that quantity to the
        inventory.
      </p>
      <p>Supported quantities are as follows:</p>
      <ul>
        <li><strong>"gr"</strong> and <strong>"kg"</strong>: grams/kilos.</li>
        <li>
          <strong>"li"</strong>, <strong>"liter"</strong>,
          <strong>"cl"</strong>, and <strong>"ml"</strong>: litres, centilitres,
          and millilitres.
        </li>
      </ul>
      <p>You can also combine "times" and measurements, like so:</p>
      <code>
        My Local store<br />
        2 x 1l water €10
      </code>
      <payment-card :payment="beerPayment" disable-actions />
      <p>You do not need quantities. By default it will just count as "one".</p>
      <p>
        If you include the "stock" category, it will add it to the inventory
        page. From there, you can ajdust the inventory — like when you use a
        product.
      </p>
    </collapsible>
    <collapsible title="How can I make use of the recipes feature?">
      <p>
        If you make proper use of the inventory (see question above), you can
        make use of the recipes feature. The recipes feature will show you which
        recipes you can make with what is currently in your inventory, how much
        it will cost to purchase the remaining items (assuming you have
        purchased them before), and the total cost.
      </p>
    </collapsible>
    <collapsible title="Can I use a currency that isn't euros?">
      <p>
        Currently there's no setting to change the symbol, but you can just
        pretend it's whatever currency you like.
      </p>
      <p>
        If you really need this,
        <a href="mailto:jip@frij.link">send me a message</a>.
      </p>
    </collapsible>
  </div>
</template>

<style lang="scss" scoped>
h2 {
  color: var(--text-secondary);
}

p {
  color: var(--text-secondary);
  margin: 1rem 0;
  margin-bottom: 30px;
}

.collapsible p {
  margin: 20px 0;
}

.collapsible {
  margin-top: 20px;
}

code {
  display: block;
  padding: 10px;
  border-radius: 6px;
  background: var(--disabled-content);
  margin: 20px 0;
}

li,
.payment-card {
  margin: 10px 0;
}
</style>

<script>
import Collapsible from '~/components/base/util/Collapsible'
import PaymentCard from '~/components/base/PaymentCard'

export default {
  components: {
    Collapsible,
    PaymentCard,
  },
  data() {
    return {
      examplePayment: {
        cents: -2750,
        categories: ['Groceries', 'food'],
        description: `My Local store\nItem one €5.50\n2x Item two €11\nItem three x 5 €11`,
      },
      recurringPayment: {
        cents: -1499,
        categories: ['Monthly', 'entertainment'],
        description: 'Netflix',
        inXDays: 10,
      },
      beerPayment: {
        cents: -1000,
        categories: ['Groceries', 'Stock'],
        description: `My Local store\n2 x 1l water €10`,
      },
    }
  },
}
</script>
