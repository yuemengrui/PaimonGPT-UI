import {http} from '/api/http'


export async function auth(username, password) {
    const args = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    }

    return await http(process.env.NEXT_PUBLIC_AUTH, args)
}


export async function auth_token_verify() {
    const args = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        }
    }

    const response = await http(process.env.NEXT_PUBLIC_AUTH_TOKEN_VERIFY, args)
    console.log('auth_token', response)

    return !!(response && response.state === 'success');
}
