import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  useDisclosure,
} from '@chakra-ui/core'

type GameOverModalProps = {
  onReturnHomeClick: () => void
  onPlayAgainClick: () => void
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  onReturnHomeClick,
  onPlayAgainClick,
}) => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

  const returnHome = () => {
    onClose()
    onReturnHomeClick()
  }

  const playAgain = () => {
    onClose()
    onPlayAgainClick()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="2xl" textAlign="center">
          Game Over!
        </ModalHeader>
        <ModalBody fontSize="lg" textAlign="center">
          What do you want to do next?
        </ModalBody>
        <ModalFooter justifyContent="space-around">
          <Button colorScheme="blue" mr={3} onClick={returnHome}>
            Return to Home
          </Button>
          <Button colorScheme="green" onClick={playAgain}>
            Play Again!
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
