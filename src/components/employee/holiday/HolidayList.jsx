import React from 'react'
import { holidays } from './holidayData'

const HolidayList = () => {
    return (
        <div class="bg-gray-50">
            <div>
                <div class="p-4">
                    <div class="bg-white p-4 rounded-md">
                        <div>
                            <div>
                                <div>
                                    <div class="flex justify-between bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-md py-2 px-4 text-white font-bold text-md">
                                        <div>
                                            <span>Date</span>
                                        </div>
                                        <div>
                                            <span>Day</span>
                                        </div>
                                        <div>
                                            <span>Festival</span>
                                        </div>
                                    </div>
                                    <div>
                                        {holidays.map((holiday, index) => {
                                            return (
                                                <div key={index} className="flex justify-between border-b text-sm font-normal mt-2 space-x-3">
                                                    <div className="px-2 w-1/3 ">
                                                        <span>{holiday.date}</span>
                                                    </div>
                                                    <div className="px-2 w-1/3 text-center">
                                                        <span>{holiday.day}</span>
                                                    </div>
                                                    <div className="px-2 w-1/3 text-end">
                                                        <span>{holiday.festival}</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default HolidayList