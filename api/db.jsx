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

export async function createDatabaseSession(app_id, preset = '', host = '', port = '', username = '', password = '', db_name = '') {
    const args = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        },
        body: JSON.stringify({
            "app_id": app_id,
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

export async function closeDatabaseSession(db_name) {
    const args = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        },
        body: JSON.stringify({
            "db_name": db_name
        })
    }

    return http(process.env.NEXT_PUBLIC_DBQA_DB_DISCONNECT, args)
}


export async function getCurrentDatabaseTableData(db_name, table_name, page, page_size) {
    const args = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        },
        body: JSON.stringify({
            "db_name": db_name,
            "table_name": table_name,
            "page": page,
            "page_size": page_size
        })
    }

    return await http(process.env.NEXT_PUBLIC_DBQA_DB_TABLE_DATA, args)
}

export async function save_table_desc(db_name, table_desc) {
    const args = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        },
        body: JSON.stringify({
            "db_name": db_name,
            "table_description": table_desc,
        })
    }

    return await http(process.env.NEXT_PUBLIC_DBQA_DB_TABLE_DESC, args)
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
