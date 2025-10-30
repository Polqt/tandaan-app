'use client'

import { MenuIcon } from 'lucide-react'
import NewDocument from './new-document'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'

export default function Sidebar() {
  const menuOptions = (
    <>
      <NewDocument />
      
    </>
  )

  return (
    <div className='p-2 md:p-5 bg-gray-200 relative'>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger><MenuIcon className='p-2 hover:opacity-30 rounded-lg' size={40} /></SheetTrigger>
          <SheetContent side='left'>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <div>
                {menuOptions}
              </div>
            </SheetHeader> 
          </SheetContent>
      </Sheet>
      </div>
      <div className="hidden md:inline"></div>
    </div>
  )
}
