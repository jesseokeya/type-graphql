import { Connection } from 'typeorm'
import { testConn } from '../../../test-utils/testConn'
import { gCall } from '../../../test-utils/gCall'

let conn: Connection

beforeAll(async () => {
    conn = await testConn()
})

afterAll(async () => {
    conn.close()
})

const registerMutation = `
mutation {
    register(
        context: {
            firstName: "Jesse"
            lastName: "Okeya"
            email: "Jesseokeya@xmail.com"
            password: "12345678"
        }
    ) {
        id
        firstName
        lastName
        email
        name
    }
}
`

describe('Register', () => {
    it('create user', async () => {
        const result = await gCall({
            source: registerMutation,
            variableValues: {
                context: {
                    firstName: "Jesse",
                    lastName: "Okeya",
                    email: "Jesseokeya@cmail.com",
                    password: "12345678"
                }
            }
        })
        // @ts-ignore
        console.log(result.errors[0])
    })
})