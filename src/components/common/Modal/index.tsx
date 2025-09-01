import ModalBody from './ModalBody';
import ModalButton, { ModalCloseButton } from './ModalButton';
import ModalDescription from './ModalDescription';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';
import ModalRoot from './ModalRoot';
import ModalTitle from './ModalTitle';

// 컴파운드 패턴을 위한 타입 정의
type ModalRootComponent = typeof ModalRoot;
type ModalHeaderComponent = typeof ModalHeader;
type ModalTitleComponent = typeof ModalTitle;
type ModalDescriptionComponent = typeof ModalDescription;
type ModalBodyComponent = typeof ModalBody;
type ModalFooterComponent = typeof ModalFooter;
type ModalButtonComponent = typeof ModalButton;
type ModalCloseButtonComponent = typeof ModalCloseButton;

interface ModalCompoundComponent extends ModalRootComponent {
  Root: ModalRootComponent;
  Header: ModalHeaderComponent;
  Title: ModalTitleComponent;
  Description: ModalDescriptionComponent;
  Body: ModalBodyComponent;
  Footer: ModalFooterComponent;
  Button: ModalButtonComponent;
  CloseButton: ModalCloseButtonComponent;
}

// 컴파운드 컴포넌트 생성
const Modal = ModalRoot as ModalCompoundComponent;

// 서브 컴포넌트들 연결
Modal.Root = ModalRoot;
Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Description = ModalDescription;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.Button = ModalButton;
Modal.CloseButton = ModalCloseButton;

export default Modal;

// 개별 컴포넌트들도 export
export {
  ModalRoot,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalButton,
  ModalCloseButton,
};

// Context도 export
export { useModalContext } from './ModalContext';
