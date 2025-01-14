import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalProps,
} from "@nextui-org/modal";
import { Student } from "../../../../../interface/student";
import { Tabs, Tab } from "@nextui-org/tabs";
import CreateStudentCertificate from "../create-student-certificate/create-student-certificate";
import StudentCertificateList from "../student-certificate-list/student-certificate-list";

interface CustomModal extends Omit<ModalProps, "children"> {
  data: Student | null;
  handleDeleteStudent: (id: string) => void;
  handleUpdateStudentData: (arg0: string, arg: Partial<Student>) => void;
}

export default function StudentModal({
  data,
  handleDeleteStudent,
  handleUpdateStudentData,
  ...props
}: CustomModal) {
  const TabsComponent = ({ onClose }: { onClose: () => void }) => {
    return (
      <Tabs aria-label="Options">
        <Tab key="Certificates" title="Certificados">
          <StudentCertificateList
            student={data as Student}
            onClose={onClose}
            handleDeleteStudent={handleDeleteStudent}
            handleUpdateStudentData={handleUpdateStudentData}
          />
        </Tab>
        <Tab key="Create" title="Crear nuevo certificado">
          <CreateStudentCertificate
            student={data as Student}
            onClose={onClose}
          />
        </Tab>
      </Tabs>
    );
  };

  return (
    <Modal {...props}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {data?.fullname}
            </ModalHeader>
            <ModalBody>
              <TabsComponent onClose={onClose} />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
