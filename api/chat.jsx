import {http} from '/api/http'

export async function chat(prompt, model_name = "") {
    const args = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "prompt": prompt,
            "model_name": model_name,
            "stream": "False"
        })
    }

    const response = await http(process.env.NEXT_PUBLIC_LLM_CHAT, args)

    console.log('response', response)

    if (response) {
        return response['data']
    }
}

export async function get_llm_list() {
    const args = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        }
    }

    const response = await http(process.env.NEXT_PUBLIC_LLM_LIST, args)

    console.log('llm list response', response)

    if (response) {
        return response['data']
    }else {
        return []
    }
}

