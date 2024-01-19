import {http} from '/api/http'


export async function get_app_list() {
    const args = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        }
    }

    const response = await http(process.env.NEXT_PUBLIC_APP_LIST, args)

    if (response) {
        return response['list']
    } else {
        return []
    }
}


export async function get_app_info(app_id) {
    const args = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        },
        body: JSON.stringify({
            "app_id": app_id
        })
    }

    return await http(process.env.NEXT_PUBLIC_APP_INFO, args)
}

export async function app_info_modify(app_id, name, description = '', llm_name, kbs=[]) {
    const args = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        },
        body: JSON.stringify({
            "app_id": app_id,
            "name": name,
            "description": description,
            "llm_name": llm_name,
            "kbs": kbs
        })
    }

    return await http(process.env.NEXT_PUBLIC_APP_INFO_MODIFY, args)

}


export async function app_create_from_appstore(app_id) {
    const args = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        },
        body: JSON.stringify({
            "app_id": app_id
        })
    }

    return await http(process.env.NEXT_PUBLIC_APP_CREATE_FROM_APPSTORE, args)

}


export async function app_create(name, llm_name, kb_id = null) {
    const args = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        },
        body: JSON.stringify({
            "name": name,
            "llm_name": llm_name,
            "kb_id": kb_id
        })
    }

    return await http(process.env.NEXT_PUBLIC_APP_CREATE, args)

}

export async function app_delete(app_id) {
    const args = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        },
        body: JSON.stringify({
            "app_id": app_id,
        })
    }

    return await http(process.env.NEXT_PUBLIC_APP_DELETE, args)

}


export async function get_app_chat_list(app_id) {
    const args = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        },
        body: JSON.stringify({
            "app_id": app_id,
        })
    }

    const response = await http(process.env.NEXT_PUBLIC_APP_CHAT_LIST, args)

    if (response) {
        return response['list']
    } else {
        return []
    }
}


export async function create_app_chat(app_id, name = undefined) {
    const args = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        },
        body: JSON.stringify({
            "app_id": app_id,
            "name": name
        })
    }

    return await http(process.env.NEXT_PUBLIC_APP_CHAT_CREATE, args)

}

export async function delete_app_chat(chat_id) {
    const args = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        },
        body: JSON.stringify({
            "chat_id": chat_id,
        })
    }

    return await http(process.env.NEXT_PUBLIC_APP_CHAT_DELETE, args)

}


export async function get_app_chat_message_list(chat_id) {
    const args = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        },
        body: JSON.stringify({
            "chat_id": chat_id,
        })
    }

    const response = await http(process.env.NEXT_PUBLIC_APP_CHAT_MESSAGE_LIST, args)

    if (response) {
        return response['list']
    } else {
        return []
    }
}
