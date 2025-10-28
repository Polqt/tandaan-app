'use client'

import { MenuIcon } from 'lucide-react'
import NewDocument from './new-document'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'

export default function Sidebar() {
  return (
    <div className='p-2 md:p-5 bg-gray-200 relative'>
      <Sheet>
        <SheetTrigger><MenuIcon className='p-2 hover:opacity-30 rounded-lg' size={40} /></SheetTrigger>
        <SheetContent side='left'>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <div>
              {/* Add menu items here */}
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <div className="hidden md:inline"></div>
      <NewDocument />
    </div>
  )
}
