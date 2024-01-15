import {http} from '/api/http'


export async function get_embedding_model_list() {
    const args = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        }
    }

    const response = await http(process.env.NEXT_PUBLIC_EMB_MODEL_LIST, args)

    console.log('response', response)

    if (response) {
        return response['data']
    } else {
        return []
    }
}

