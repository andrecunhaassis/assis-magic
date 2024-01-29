import { UserDataProps, UserFromSheetProps } from "@/interfaces";

export async function saveUserProfile(data: UserDataProps) {
    try {
        const response = await fetch('/api/sheets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SECRET_KEY}`
            },
            body: JSON.stringify({ 
                data: {
                    full_name: data.name || 'Seu Nome',
                    description_profile: data.bio,
                    bio_insta: data.insta_bio,
                    username_insta: data.nick,
                    profile_pic_url: data.img == '/img/user.png' ? 'https://assis-magic.vercel.app/img/user.png' : data.img,
                    links: data.links,
                    secondary_color: data.color,
                    gpt_count_usage: 1,
                    profile_count_generated: 1,
                    company_name: data.company,
                    business_vertical: data.category,
                }
            })
        })
        const result = await response.json()
        return result
    }
    catch (error) {
        console.log(error)
        return null
    }
}

export async function updateUserProfile(data: UserFromSheetProps, email: string, has_used_gpt: boolean) {
    // console.log(data)
    try {
        const response = await fetch('/api/sheets', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SECRET_KEY}`
            },
            body: JSON.stringify({ 
                data: {
                    row_index: data.row_index,
                    description_profile: data.description_profile,
                    bio_insta: data.bio_insta,
                    profile_pic_url: data.profile_pic_url,
                    links: data.links ? JSON.stringify(data.links) : '',
                    secondary_color: data.secondary_color,
                    gpt_count_usage: has_used_gpt ? Number(data.gpt_count_usage || 1) + 1 : data.gpt_count_usage,
                    profile_count_generated: Number(data.profile_count_generated || 1) + 1,
                    email: email || data.email || '',
                    company_name: data.company_name,
                    business_vertical: data.business_vertical,
                }
            })
        })
        const result = await response.json()
        return result
    }
    catch (error) {
        console.log(error)
        return null
    }
}

export async function getUserProfile(username: string) {
    try {
        const response = await fetch(`/api/sheets?field=username_insta&value=${encodeURIComponent(username)}`, {
            headers: {
                contentType: 'application/json',
                authorization: `Bearer ${process.env.NEXT_PUBLIC_SECRET_KEY}`
            }
        })
        const result = await response.json()
        return result
    }
    catch (error) {
        console.log(error)
        return null
    }
}