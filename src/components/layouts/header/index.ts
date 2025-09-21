export interface MenuItem {
    route: string,
    name: string,
    title: string
}

export interface Props {
    menu?: MenuItem[],
    title?: string,
    isShowTop: boolean, 
    simulatingTime: string
}