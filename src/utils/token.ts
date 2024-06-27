// 封装本地存储数据与读取数据反复噶
export const SET_TOKEN = (token: string) => {
  localStorage.setItem('TOKEN', token)
}

export const GET_TOKEN = () => {
  return localStorage.getItem('TOKEN')
}

export const REMOVE_TOKEN = () => {
  localStorage.removeItem('TOKEN')
}

// 封装本地存储数据与读取数据反复噶
export const SET_USERNAME = (username: string) => {
  localStorage.setItem('USERNAME', username)
}

export const GET_USERNAME = () => {
  return localStorage.getItem('USERNAME')
}

export const REMOVE_USERNAME = () => {
  localStorage.removeItem('USERNAME')
}

// 封装本地存储数据与读取数据反复噶
export const SET_AVATAR = (avatar: string) => {
  localStorage.setItem('AVATAR', avatar)
}

export const GET_AVATAR = () => {
  return localStorage.getItem('AVATAR')
}

export const REMOVE_AVATAR = () => {
  localStorage.removeItem('AVATAR')
}
