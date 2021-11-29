interface WomAboard {
    confirm: number
    confirmAdd: number
    confirmAddCut: number
    confirmCompare: number
    continent: string
    date: string
    dead: number
    deadCompare: number
    heal: number
    healCompare: number
    name: string
    nowConfirm: number
    nowConfirmCompare: number
    pub_date: string
    suspect: number
    y: string,
    value?: number
}

interface Total {
    certain: string
    certain_inc: string
    die: string
    die_inc: string
    ecertain: string
    ecertain_inc:string
    recure: string
    recure_inc: string
    uncertain: string
    uncertain_inc: string
}

export type {
    WomAboard,
    Total
}
