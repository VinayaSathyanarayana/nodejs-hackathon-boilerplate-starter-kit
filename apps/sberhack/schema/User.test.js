/**
 * @jest-environment node
 */

const { createSchemaObject, setFakeClientMode, getRandomString } = require('@core/keystone/test.utils')
const { makeLoggedInClient, makeLoggedInAdminClient, makeClient, createUser, gql } = require('@core/keystone/test.utils')
const conf = require('@core/config')
if (conf.TESTS_FAKE_CLIENT_MODE) setFakeClientMode(require.resolve('../index'))

const { User } = require('../schema/User')

const ALL_USERS_QUERY = gql`
    query {
        users: allUsers {
            id
            email
            name
        }
    }
`

const COUNT_OF_USERS_QUERY = gql`
    query {
        meta: _allUsersMeta {
            count
        }
    }
`

const GET_USER_BY_ID_QUERY = gql`
    query getUserById($id: ID!) {
        user: User(where: {id: $id}) {
            id
            email
            name
        }
    }
`

test('user: add new function', async () => {
    const client = await makeLoggedInAdminClient()
    const email = 'XXX' + getRandomString() + '@example.com'
    const user = await createUser({ email })

    const { data } = await client.query(GET_USER_BY_ID_QUERY, { id: user.id })
    expect(data.user).toEqual({ email: email.toLowerCase(), id: user.id, name: user.name })

    const client2 = await makeLoggedInClient({ email: email.toLowerCase(), password: user.password })
    expect(client2.user.id).toEqual(user.id)

    // TODO(pahaz): fix in a future (it's no OK if you can't logged in by upper case email)
    const checkAuthByUpperCaseEmail = async () => {
        await makeLoggedInClient({ email, password: user.password })
    }
    await expect(checkAuthByUpperCaseEmail).rejects.toThrow(/passwordAuth:identity:notFound/)
})
