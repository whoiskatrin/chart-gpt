import { Fragment, ReactNode, useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import LoadingDots from "./LoadingDots";

type Props = {
  children?: ReactNode,
  show: boolean,
  wait: number,
  showLoading: boolean,
}

export default function ChatBubble({ children, show=false, wait=0, showLoading }: Props) {
  const [showBubble, setShowBubble] = useState(show);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(showLoading);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoadingIndicator(false);
      setShowBubble(true);
    }, wait);

    return () => clearTimeout(timeout);
  }, []);
  
  return (
     <div className="p-2 m-2 bg-indigo-100 text-black border-indigo-100 rounded-2xl" >
        { showLoadingIndicator && 
          <div className="pl-2">
            <LoadingDots color={"blue"}/> 
          </div>
        }
        <Transition 
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            show={showBubble}
          >
            <div>{children}</div>
        </Transition>
      </div>
  )
}
