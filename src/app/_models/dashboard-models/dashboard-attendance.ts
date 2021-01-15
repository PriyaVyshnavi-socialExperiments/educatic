export interface IAttendance {
    present: number,
    total: number,
    male: {
      present: number,
      total: number
    },
    female: {
      present: number,
      total: number
    },
    nonBinary: {
      present: number,
      total: number
    }
}