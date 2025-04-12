export enum your_role_in_our_village{
    Villager ="Villager",
    sarpanch = "sarpanch"
}

export function enumToMap(enumObj: any): { label: string; value: string }[] {
    return Object.keys(enumObj)
      .filter(key => isNaN(Number(key)))
      .map(key => ({ label: key, value: enumObj[key] }));
}