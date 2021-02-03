/* eslint-disable require-await */
export default async ({ $auth, redirect }) => {
  const user = $auth.user
  if (!user) {
    redirect('/login')
  }
}
