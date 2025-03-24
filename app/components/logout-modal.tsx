import { useState } from "react";
import { Link } from "react-router";


interface LogoutModalProps {
    isPoping: boolean,
    setIsPoping: (state: boolean) => void,
}


export function LogoutModal({ isPoping, setIsPoping }: LogoutModalProps) {
    return (
        <div>
            {isPoping && (
              <div className="fixed z-50 h-full w-full top-0">
                <div className="relative h-full w-full bg-obsidian opacity-30"></div>
                <div className="absolute h-full w-full top-0 flex flex-col justify-center items-center">
                  <div className="flex flex-col p-6 gap-3 bg-white-smoke rounded-md text-xl">
                    <p>ต้องการออกจากระบบใช่ไหม</p>
                    <div className="flex flex-rol justify-evenly items-center">
                      <button
                        className="bg-white-smoke text-obsidian border-[1px] p-1 rounded-md active:bg-gray-400 active:text-white-smoke active:scale-105 duration-300"
                        onClick={() => {
                            setIsPoping(false)
                        }}
                      >
                        ยกเลิก
                      </button>
                      <Link
                        to={"/logout"}
                        className="bg-red-600 text-white-smoke border-[1px] p-1 rounded-md hover:bg-white-smoke hover:text-red-600 hover:scale-105 duration-300"
                      >
                        ยืนยัน
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
    );
}