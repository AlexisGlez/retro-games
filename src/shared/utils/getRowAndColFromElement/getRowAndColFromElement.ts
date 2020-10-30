export function getRowAndColFromElement(element: HTMLElement) {
  const dataRow = element.getAttribute('data-row')
  const dataCol = element.getAttribute('data-col')

  if (dataRow == null || dataCol == null) {
    return { row: -1, col: -1 }
  }

  const row = parseInt(dataRow)
  const col = parseInt(dataCol)

  if (Number.isNaN(row) || Number.isNaN(col)) {
    return { row: -1, col: -1 }
  }

  return { row, col }
}
