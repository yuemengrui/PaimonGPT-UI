import {http} from '/api/http'


export async function fileUpload(formData) {
    const args = {
        method: "POST",
        headers: {
            "Authorization": localStorage.getItem('Authorization')
        },
        body: formData
    }

    const response = await http(process.env.NEXT_PUBLIC_FILE_UPLOAD, args)

    if (response) {
        return response
    }
}
