import {http} from '/api/http'


export async function get_appstore_app_list() {
    const args = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        }
    }

    const response = await http(process.env.NEXT_PUBLIC_APPSTORE_APP_LIST, args)

    if (response) {
        return response['data']
    } else {
        return []
    }
}


export async function appstore_app_install(name, module_name, description = '') {
    const args = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('Authorization')
        },
        body: JSON.stringify({
            "name": name,
            "module_name": module_name,
            "description": description
        })
    }

    return await http(process.env.NEXT_PUBLIC_APPSTORE_APP_INSTALL, args)
}

export async function appstore_app_uninstall(app_id) {
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

    return await http(process.env.NEXT_PUBLIC_APPSTORE_APP_UNINSTALL, args)

}


