import {http} from "/api/http";


export async function getPresetDatabases() {
    const args = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        }
    }

    const response = await http(process.env.NEXT_PUBLIC_DBQA_DB_PRESETS, args)

    if (response) {
        return response['data']
    } else {
        return []
    }
}

export async function createDatabaseSession(preset = '', host = '', port = '', username = '', password = '', db_name = '') {
    const args = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        },
        body: JSON.stringify({
            "preset": preset,
            "host": host,
            "port": port,
            "username": username,
            "password": password,
            "db_name": db_name
        })
    }

    return await http(process.env.NEXT_PUBLIC_DBQA_DB_CONNECT, args)
}

export function closeDatabaseSession(session) {
    return http('/', {
        method: 'DELETE',
        headers: {
            Authorization: localStorage.getItem("Authorization"),
        },
        body: JSON.stringify({session}),
    })
}

export function getCurrentDatabaseTableStructure(session, table) {
    let url = '/' + `?session=${session}&table=${table}`
    return http(url)
}

export function getCurrentDatabaseTableData(session, table, page, pageSize) {
    let url = '/' + `?session=${session}&table=${table}&page=${page}&pageSize=${pageSize}`
    return http(url)
}


export async function db_chat(db_name, model_name, prompt, history = [], generation_configs = {}) {
    const args = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        },
        body: JSON.stringify({
            "db_name": db_name,
            "model_name": model_name,
            "prompt": prompt,
            "history": history,
            "generation_configs": generation_configs
        })
    }

    return await http(process.env.NEXT_PUBLIC_DBQA_DB_CHAT, args)
}
