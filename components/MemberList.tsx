'use client'

import { Mail, Edit, ListTodo, Trash2, Check, X } from 'lucide-react'
import Link from 'next/link'
import { GiftExchangeMember } from '@prisma/client'
import { User } from '@prisma/client'


export function MemberList({ members, exchangeId }: {members: (GiftExchangeMember & {user: User})[], exchangeId: string}) {
    return (
        <div className="mt-6">
            <p className="font-semibold text-sm mb-2">Members:</p>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border border-gray-300 dark:border-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            <th className="px-4 py-2 text-center">Membership</th>
                            <th className="px-4 py-2 text-center">Name</th>
                            <th className="px-4 py-2 text-center">Assigned</th>
                            <th className="px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr key={member.user.id} className="border-t dark:border-gray-700">
                                <td className="px-4 py-2 border-r">
                                    <span className='inline-block w-20'>
                                        {member.role === 'ADMIN' && (
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300">
                                                Admin
                                            </span>
                                        )}
                                        {member.role === 'MEMBER' && (
                                            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-gray-800 dark:text-gray-300">
                                                Member
                                            </span>
                                        )}
                                    </span>{' '}


                                </td>
                                <td className="px-4 py-2 border-r">
                                    {member.user.name || member.user.email}
                                </td>
                                <td className="px-4 py-2 border-r flex justify-center">
                                    {member.assignedToId
                                        ? <span title={`${member.user.name} has been assigned a recipient.`}><Check /></span>
                                        : <span title={`${member.user.name} needs assignment.`}><X /></span>}
                                </td>
                                <td className="">
                                    <div className='flex justify-around'>
                                        <Mail />
                                        <Edit />
                                        <Link
                                            href={`/exchanges/${exchangeId}/members/${member.id}/wishlist`}
                                            title="View wishlist"
                                            className="text-gray-600 hover:text-blue-600"
                                        >
                                            <ListTodo />
                                        </Link>
                                        <Trash2 />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
