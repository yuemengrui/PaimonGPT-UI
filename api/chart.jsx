import {http} from '/api/http'

export async function chart_chat(payload) {
    const args = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        },
        body: JSON.stringify(payload)
    }

    const response = await http(process.env.NEXT_PUBLIC_CHART_CHAT, args)

    if (response) {
        return response
    }
}
