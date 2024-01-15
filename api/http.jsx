export async function http(url, args) {
    const response = await fetch(url, args)
    return await response.json()
}
