// Need to modify the value of this enum
export enum TempleStyle{
    NAGARA = 'N',
    DRAVIDA = 'D',
    VESARA = 'V',
    OTHER = 'O'
}

export function enumToMap(enumObj: any): { label: string; value: string }[] {
    return Object.keys(enumObj)
      .filter(key => isNaN(Number(key)))
      .map(key => ({ label: key, value: enumObj[key] }));
}