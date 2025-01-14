import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalProps,
} from "@nextui-org/modal";

type CustomModal = Omit<ModalProps, "children">;

const NotFoundModal = ({ ...props }: CustomModal) => {
  const handleOpenWhatsApp = () => {
    const whatsappLink = `https://wa.link/8olvby`;
    window.open(whatsappLink);
  };

  return (
    <Modal {...props}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Estudiante no encontrado
            </ModalHeader>
            <ModalBody>
              <p>
                El estudiante no está registrado, para más información
                comuníquese por whatsapp (0984127670){" "}
              </p>
              <Button color="success" onPress={handleOpenWhatsApp}>
                Abrir whatsapp
              </Button>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default NotFoundModal;
