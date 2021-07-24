/// <reference path="./ChessController.d.ts" />

const blackRookImageUrl = 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png'
const blackKnightImageUrl = 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png'
const blackBishopImageUrl = 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png'
const blackKingImageUrl = 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png'
const blackQueenImageUrl = 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png'
const blackPawnImageUrl = 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png'
const whiteRookImageUrl = 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png'
const whiteKnightImageUrl = 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png'
const whiteBishopImageUrl = 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png'
const whiteKingImageUrl = 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png'
const whiteQueenImageUrl = 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png'
const whitePawnImageUrl = 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png'

const initialGameSetup: ChessGame.Game = [
  [
    { color: 'blacks', value: 'rook', imageUrl: blackRookImageUrl },
    { color: 'blacks', value: 'knight', imageUrl: blackKnightImageUrl },
    { color: 'blacks', value: 'bishop', imageUrl: blackBishopImageUrl },
    { color: 'blacks', value: 'queen', imageUrl: blackQueenImageUrl },
    { color: 'blacks', value: 'king', imageUrl: blackKingImageUrl },
    { color: 'blacks', value: 'bishop', imageUrl: blackBishopImageUrl },
    { color: 'blacks', value: 'knight', imageUrl: blackKnightImageUrl },
    { color: 'blacks', value: 'rook', imageUrl: blackRookImageUrl },
  ],
  [
    { color: 'blacks', value: 'pawn', imageUrl: blackPawnImageUrl },
    { color: 'blacks', value: 'pawn', imageUrl: blackPawnImageUrl },
    { color: 'blacks', value: 'pawn', imageUrl: blackPawnImageUrl },
    { color: 'blacks', value: 'pawn', imageUrl: blackPawnImageUrl },
    { color: 'blacks', value: 'pawn', imageUrl: blackPawnImageUrl },
    { color: 'blacks', value: 'pawn', imageUrl: blackPawnImageUrl },
    { color: 'blacks', value: 'pawn', imageUrl: blackPawnImageUrl },
    { color: 'blacks', value: 'pawn', imageUrl: blackPawnImageUrl },
  ],
  [
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
  ],
  [
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
  ],
  [
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
  ],
  [
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
    { color: '', value: '', imageUrl: '' },
  ],
  [
    { color: 'whites', value: 'pawn', imageUrl: whitePawnImageUrl },
    { color: 'whites', value: 'pawn', imageUrl: whitePawnImageUrl },
    { color: 'whites', value: 'pawn', imageUrl: whitePawnImageUrl },
    { color: 'whites', value: 'pawn', imageUrl: whitePawnImageUrl },
    { color: 'whites', value: 'pawn', imageUrl: whitePawnImageUrl },
    { color: 'whites', value: 'pawn', imageUrl: whitePawnImageUrl },
    { color: 'whites', value: 'pawn', imageUrl: whitePawnImageUrl },
    { color: 'whites', value: 'pawn', imageUrl: whitePawnImageUrl },
  ],
  [
    { color: 'whites', value: 'rook', imageUrl: whiteRookImageUrl },
    { color: 'whites', value: 'knight', imageUrl: whiteKnightImageUrl },
    { color: 'whites', value: 'bishop', imageUrl: whiteBishopImageUrl },
    { color: 'whites', value: 'queen', imageUrl: whiteQueenImageUrl },
    { color: 'whites', value: 'king', imageUrl: whiteKingImageUrl },
    { color: 'whites', value: 'bishop', imageUrl: whiteBishopImageUrl },
    { color: 'whites', value: 'knight', imageUrl: whiteKnightImageUrl },
    { color: 'whites', value: 'rook', imageUrl: whiteRookImageUrl },
  ],
]

export class ChessController {
  private game: ChessGame.Game
  private gameStatus: GameStatus

  private currentPlayer: ChessGame.Player

  private players: { [key in ChessGame.PlayerColor]: ChessGame.Player } = {
    blacks: {
      color: 'blacks',
      isInCheck: false,
      kingPos: {  row: 0, col: 4 }
    },
    whites: {
      color: 'whites',
      isInCheck: false,
      kingPos: {  row: 7, col: 4 }
    }
  }

  public constructor() {
    this.game = initialGameSetup
    this.gameStatus = 'ongoing'
    this.currentPlayer = this.players.whites
  }

  public getGameState(): ChessGame.State {
    return { game: this.game, gameStatus: this.gameStatus }
  }

  public getNextGameState(from: ChessGame.Move, to: ChessGame.Move): ChessGame.State {
    // TODO: validate check mate and tie every time a move is valid.

    if (this.isValidMove(from, to)) {
      const cellFrom = this.getCellAtPosition(from)
      const tempFrom = { ...cellFrom }
      const cellTo = this.getCellAtPosition(to)
      const tempTo = { ...cellTo }

      cellTo.color = cellFrom.color
      cellTo.imageUrl = cellFrom.imageUrl
      cellTo.value = cellFrom.value
      cellTo.hasMoved = cellFrom.hasMoved
      this.promotePawnToQueenIfNeeded(to)
      cellFrom.color = ''
      cellFrom.imageUrl = ''
      cellFrom.value = ''

      if (tempFrom.value === 'king') {
        this.currentPlayer.kingPos = to
      }

      if (this.currentPlayer.isInCheck && this.isKingInCheck(this.players[this.currentPlayer.color].kingPos)) {
        // Undo movement if king is still in check after new movement
        cellFrom.color = tempFrom.color
        cellFrom.imageUrl = tempFrom.imageUrl
        cellFrom.value = tempFrom.value
        cellFrom.hasMoved = tempFrom.hasMoved
        cellTo.color = tempTo.color
        cellTo.imageUrl = tempTo.imageUrl
        cellTo.value = tempTo.value
        cellTo.hasMoved = tempTo.hasMoved

        if (tempFrom.value === 'king') {
          this.currentPlayer.kingPos = from
        }
      } else {
        if (this.currentPlayer.color === 'whites' && this.isKingInCheck(this.players.blacks.kingPos, true)) {
          this.players.blacks.isInCheck = true
        } else if (this.currentPlayer.color === 'blacks' && this.isKingInCheck(this.players.whites.kingPos, true)) {
          this.players.whites.isInCheck = true
        }
  
        this.currentPlayer = this.currentPlayer.color === 'whites' ? this.players.blacks : this.players.whites 
      }
    } else if (this.isValidCastling(from, to)) {
      const cellFrom = this.getCellAtPosition(from)
      const tempFrom = { ...cellFrom }
      const cellTo = this.getCellAtPosition(to)
      const tempTo = { ...cellTo }
      
      const kingMove: ChessGame.Move = { row: from.row, col: from.col < to.col ? from.col + 2 : from.col - 2 }
      const newKingCell = this.getCellAtPosition(kingMove)
      const tempNewKingCell = { ...newKingCell }
      const newRookCell = this.getCellAtPosition({ row: from.row, col: from.col < to.col ? kingMove.col - 1 : kingMove.col + 1 })
      const tempNewRookCell = { ...newRookCell }
      
      newKingCell.color = cellFrom.color
      newKingCell.hasMoved = cellFrom.hasMoved
      newKingCell.imageUrl = cellFrom.imageUrl
      newKingCell.value = cellFrom.value

      newRookCell.color = cellTo.color
      newRookCell.hasMoved = cellTo.hasMoved
      newRookCell.imageUrl = cellTo.imageUrl
      newRookCell.value = cellTo.value


      cellTo.color = ''
      cellTo.imageUrl = ''
      cellTo.value = ''

      cellFrom.color = ''
      cellFrom.imageUrl = ''
      cellFrom.value = ''

      this.currentPlayer.kingPos = kingMove

      if (this.currentPlayer.isInCheck && this.isKingInCheck(kingMove)) {
        // Undo movement if king is still in check after new movement
        cellFrom.color = tempFrom.color
        cellFrom.imageUrl = tempFrom.imageUrl
        cellFrom.value = tempFrom.value
        cellFrom.hasMoved = tempFrom.hasMoved
        cellTo.color = tempTo.color
        cellTo.imageUrl = tempTo.imageUrl
        cellTo.value = tempTo.value
        cellTo.hasMoved = tempTo.hasMoved
        newKingCell.color = tempNewKingCell.color
        newKingCell.imageUrl = tempNewKingCell.imageUrl
        newKingCell.value = tempNewKingCell.value
        newKingCell.hasMoved = tempNewKingCell.hasMoved
        newRookCell.color = tempNewRookCell.color
        newRookCell.imageUrl = tempNewRookCell.imageUrl
        newRookCell.value = tempNewRookCell.value
        newRookCell.hasMoved = tempNewRookCell.hasMoved
        this.currentPlayer.kingPos = from
      } else {
        if (this.currentPlayer.color === 'whites' && this.isKingInCheck(this.players.blacks.kingPos, true)) {
          this.players.blacks.isInCheck = true
        } else if (this.currentPlayer.color === 'blacks' && this.isKingInCheck(this.players.whites.kingPos, true)) {
          this.players.whites.isInCheck = true
        }
  
        this.currentPlayer = this.currentPlayer.color === 'whites' ? this.players.blacks : this.players.whites 
      }
    }

    return this.getGameState()
  }

  private getCellAtPosition(pos: ChessGame.Move): ChessGame.Cell {
    return this.game[pos.row]?.[pos.col] ?? {color: '', imageUrl: '', value: ''}
  }

  public isCurrentPlayerPieceAtPos(pos: ChessGame.Move): boolean {
    const cell = this.getCellAtPosition(pos)

    return cell.value !== '' && cell.color === this.currentPlayer.color
  }

  private isValidMove(from: ChessGame.Move, to: ChessGame.Move): boolean {
    if (!this.isCurrentPlayerPieceAtPos(from)) {
      return false
    }
    
    if (this.isCurrentPlayerPieceAtPos(to)) {
      return false
    }
    
    const cellFrom = this.getCellAtPosition(from)

    // TODO: refactor to use specific objects for each piece, too tired right now...
    switch (cellFrom.value) {
      case 'pawn':
        return this.isValidPawnMove(from, to)
      case 'bishop':
        return this.isValidBishopMove(from, to)
      case 'king':
        return this.isValidKingMove(from, to)
      case 'queen':
        return this.isValidQueenMove(from, to)
      case 'rook':
        return this.isValidRookMove(from, to)
      case 'knight':
        return this.isValidKnightMove(from, to)
    }

    return false
  }

  private isValidPawnMove(from: ChessGame.Move, to: ChessGame.Move) {
    if (this.currentPlayer.color === 'whites') {
      if (from.row <= to.row) {
        return false
      }
      const rowDiff = from.row - to.row
      if (from.row === 6) {
        if (rowDiff > 2) {
          return false
        }
      } else if (rowDiff > 1) {
        return false
      }
    } else {
      if (from.row >= to.row) {
        return false
      }
      const rowDiff = to.row - from.row
      if (from.row === 1) {
        if (rowDiff > 2) {
          return false
        }
      } else if (rowDiff > 1) {
        return false
      }
    }

    const cellTo = this.getCellAtPosition(to)

    if (from.col === to.col) {
      if (cellTo.value !== '') {
        return false
      }
    } else {
      const colDiff = Math.abs(from.col - to.col)
      if (colDiff > 1) {
        return false
      }

      if (cellTo.value === '') {
        return false
      }
    }

    return true
  }

  private isValidRookMove(from: ChessGame.Move, to: ChessGame.Move) {
    const isMovingVertically = from.row !== to.row
    const isMovingHorizontally = from.col !== to.col
    if (isMovingVertically && isMovingHorizontally) {
      return false
    }

    if (isMovingVertically) {
      if (from.row > to.row) {
        for (let i = from.row - 1; i > to.row; i -= 1) {
          if (this.getCellAtPosition({ row: i, col: from.col }).value !== '') {
            return false
          }
        }
      } else {
        for (let i = from.row + 1; i < to.row; i += 1) {
          if (this.getCellAtPosition({ row: i, col: from.col }).value !== '') {
            return false
          }
        }
      }
    } else {
      if (from.col > to.col) {
        for (let i = from.col - 1; i > to.col; i -= 1) {
          if (this.getCellAtPosition({ row: from.row, col: i }).value !== '') {
            return false
          }
        }
      } else {
        for (let i = from.col + 1; i < to.col; i += 1) {
          if (this.getCellAtPosition({ row: from.row, col: i }).value !== '') {
            return false
          }
        }
      }
    }

    this.getCellAtPosition(from).hasMoved = true;

    return true
  }

  private isValidBishopMove(from: ChessGame.Move, to: ChessGame.Move) {
    if (from.col === to.col || from.row === to.row) {
      return false
    }

    if (Math.abs(from.col - to.col) !== Math.abs(from.row - to.row)) {
      return false
    }

    if (from.row > to.row) {
      if (from.col > to.col) {
        for (let i = from.row - 1, j = from.col - 1; i > to.row; i -= 1, j -= 1) {
          if (this.getCellAtPosition({ row: i, col: j }).value !== '') {
            return false
          }
        }
      } else {
        for (let i = from.row - 1, j = from.col + 1; i > to.row; i -= 1, j += 1) {
          if (this.getCellAtPosition({ row: i, col: j }).value !== '') {
            return false
          }
        }
      }
    } else {
      if (from.col > to.col) {
        for (let i = from.row + 1, j = from.col - 1; i < to.row; i += 1, j -= 1) {
          if (this.getCellAtPosition({ row: i, col: j }).value !== '') {
            return false
          }
        }
      } else {
        for (let i = from.row + 1, j = from.col + 1; i < to.row; i += 1, j += 1) {
          if (this.getCellAtPosition({ row: i, col: j }).value !== '') {
            return false
          }
        }
      }
    }

    return true
  }

  private isValidQueenMove(from: ChessGame.Move, to: ChessGame.Move) {
    return this.isValidRookMove(from, to) || this.isValidBishopMove(from, to)
  }

  private isValidKnightMove(from: ChessGame.Move, to: ChessGame.Move) {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);
  
    if ((rowDiff !== 2 || colDiff !== 1) && (rowDiff !== 1 || colDiff !== 2)) {
      return false
    }
  
    return true
  }

  private isValidKingMove(from: ChessGame.Move, to: ChessGame.Move) {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);

    if (rowDiff > 1 || colDiff > 1) {
      return false
    }

    const toCell = this.getCellAtPosition({ row: to.row, col: to.col })

    if (toCell.color === this.currentPlayer.color) {
      return false
    }

    if (this.isKingInCheck(to)) {
      return false
    }

    this.getCellAtPosition(from).hasMoved = true;

    return true
  }

  private isValidCastling(from: ChessGame.Move, to: ChessGame.Move) {
    const cellFrom = this.getCellAtPosition(from)
    const cellTo = this.getCellAtPosition(to)

    if (cellFrom.value !== 'king' || cellTo.value !== 'rook' || cellFrom.color !== cellTo.color) {
      return false
    }

    if (cellFrom.hasMoved || cellTo.hasMoved) {
      return false
    }

    if (from.row !== to.row) {
      return false
    }

    if (from.col < to.col) {
      for (let i = from.col + 1; i < to.col; i += 1) {
        if (this.getCellAtPosition({ row: from.row, col: i }).value !== '') {
          return false
        }
      }
    } else {
      for (let i = from.col - 1; i > to.col; i -= 1) {
        if (this.getCellAtPosition({ row: from.row, col: i }).value !== '') {
          return false
        }
      }
    }

    if (this.isKingInCheck(to)) {
      return false
    }

    cellFrom.hasMoved = true;
    cellTo.hasMoved = true;
    
    return true
  }

  private isKingInCheck(kingPos: ChessGame.Move, shouldUseEnemyKingColor: boolean = false) {
    const enemyColor: ChessGame.PlayerColor = this.currentPlayer.color === 'whites' ? 'blacks' : 'whites'
    const targetColor: ChessGame.PlayerColor = shouldUseEnemyKingColor ? enemyColor : this.currentPlayer.color
    let cell: ChessGame.Cell
    let distance, i, j: number

    // check down
    for (i = kingPos.row - 1, distance = 1; i >= 0; i -= 1, distance += 1) {
      cell = this.getCellAtPosition({ row: i, col: kingPos.col })
      
      if (cell.value === '') {
        continue
      }

      if (cell.color === targetColor) {
        break
      }

      if ((cell.value === 'king' && distance === 1) || cell.value === 'queen' || cell.value === 'rook') {
        return true
      }

      break
    }

    // check up
    for (i = kingPos.row + 1, distance = 1; i <= 7; i += 1, distance += 1) {
      cell = this.getCellAtPosition({ row: i, col: kingPos.col })

      
      if (cell.value === '') {
        continue
      }

      if (cell.color === targetColor) {
        break
      }

      if ((cell.value === 'king' && distance === 1) || cell.value === 'queen' || cell.value === 'rook') {
        return true
      }

      break
    }

    // check left
    for (i = kingPos.col - 1, distance = 1; i >= 0; i -= 1, distance += 1) {
      cell = this.getCellAtPosition({ row: kingPos.row, col: i })

      
      if (cell.value === '') {
        continue
      }

      if (cell.color === targetColor) {
        break
      }

      if ((cell.value === 'king' && distance === 1) || cell.value === 'queen' || cell.value === 'rook') {
        return true
      }

      break
    }

    // check right
    for (i = kingPos.col + 1, distance = 1; i <= 7; i += 1, distance += 1) {
      cell = this.getCellAtPosition({ row: kingPos.row, col: i })

      
      if (cell.value === '') {
        continue
      }

      if (cell.color === targetColor) {
        break
      }

      if ((cell.value === 'king' && distance === 1) || cell.value === 'queen' || cell.value === 'rook') {
        return true
      }

      break
    }

    // check down left
    for (i = kingPos.row - 1, j = kingPos.col - 1, distance = 1; i >= 0; i -= 1, j -= 1, distance += 1) {
      cell = this.getCellAtPosition({ row: i, col: j })

      if (cell.value === '') {
        continue
      }

      if (cell.color === targetColor) {
        break
      }

      if (distance === 1) {
        if (cell.value === 'king') {
          return true
        }


        if (targetColor === 'whites' && cell.value === 'pawn') {
          return true
        }
      }

      if (cell.value === 'queen' || cell.value === 'bishop') {
        return true
      }

      break
    }

    // check down right
    for (i = kingPos.row - 1, j = kingPos.col + 1, distance = 1; i >= 0; i -= 1, j += 1, distance += 1) {
      cell = this.getCellAtPosition({ row: i, col: j })
      
      if (cell.value === '') {
        continue
      }

      if (cell.color === targetColor) {
        break
      }

      if (distance === 1) {
        if (cell.value === 'king') {
          return true
        }

        if (targetColor === 'whites' && cell.value === 'pawn') {
          return true
        }
      }

      if (cell.value === 'queen' || cell.value === 'bishop') {
        return true
      }

      break
    }

    // check up left
    for (i = kingPos.row + 1, j = kingPos.col - 1, distance = 1; i <= 7; i += 1, j -= 1, distance += 1) {
      cell = this.getCellAtPosition({ row: i, col: j })
      
      if (cell.value === '') {
        continue
      }

      if (cell.color === targetColor) {
        break
      }

      if (distance === 1) {
        if (cell.value === 'king') {
          return true
        }

        if (targetColor === 'blacks' && cell.value === 'pawn') {
          return true
        }
      }

      if (cell.value === 'queen' || cell.value === 'bishop') {
        return true
      }

      break
    }

    // check up right
    for (i = kingPos.row + 1, j = kingPos.col + 1, distance = 1; i <= 7; i += 1, j += 1, distance += 1) {
      cell = this.getCellAtPosition({ row: i, col: j })
      
      if (cell.value === '') {
        continue
      }

      if (cell.color === targetColor) {
        break
      }

      if (distance === 1) {
        if (cell.value === 'king') {
          return true
        }

        if (targetColor === 'blacks' && cell.value === 'pawn') {
          return true
        }
      }

      if (cell.value === 'queen' || cell.value === 'bishop') {
        return true
      }

      break
    }

    // check for knights
    cell = this.getCellAtPosition({row: kingPos.row - 1, col: kingPos.col - 2})
    if (cell.color !== targetColor && cell.value === 'knight') {
      return true
    }

    cell = this.getCellAtPosition({row: kingPos.row - 1, col: kingPos.col + 2})
    if (cell.color !== targetColor && cell.value === 'knight') {
      return true
    }

    cell = this.getCellAtPosition({row: kingPos.row + 1, col: kingPos.col - 2})
    if (cell.color !== targetColor && cell.value === 'knight') {
      return true
    }

    cell = this.getCellAtPosition({row: kingPos.row + 1, col: kingPos.col + 2})
    if (cell.color !== targetColor && cell.value === 'knight') {
      return true
    }

    cell = this.getCellAtPosition({row: kingPos.row - 2, col: kingPos.col - 1})
    if (cell.color !== targetColor && cell.value === 'knight') {
      return true
    }

    cell = this.getCellAtPosition({row: kingPos.row - 2, col: kingPos.col + 1})
    if (cell.color !== targetColor && cell.value === 'knight') {
      return true
    }

    cell = this.getCellAtPosition({row: kingPos.row + 2, col: kingPos.col - 1})
    if (cell.color !== targetColor && cell.value === 'knight') {
      return true
    }

    cell = this.getCellAtPosition({row: kingPos.row + 2, col: kingPos.col + 1})
    if (cell.color !== targetColor && cell.value === 'knight') {
      return true
    }

    return false;
  }

  private promotePawnToQueenIfNeeded(pos: ChessGame.Move) {
    const cell = this.getCellAtPosition(pos)
  
    if (cell.value !== 'pawn') {
      return
    }

    if (this.currentPlayer.color === 'whites') {
      if (pos.row === 0) {
        cell.value = 'queen'
        cell.imageUrl = whiteQueenImageUrl
      }
    } else {
      if (pos.row === 7) {
        cell.value = 'queen'
        cell.imageUrl = blackQueenImageUrl
      }
    }
  }
}
