'use client'

import { Mail, Edit, ListTodo, Trash2, Check, X } from 'lucide-react'

interface Member {
    id: string
    role: 'ADMIN' | 'MEMBER'
    user: {
        id: string
        name: string | null
        email: string
    }
    assignedToId: string | null
}

interface MemberListProps {
    members: Member[]
    onRevoke?: (memberId: string) => void
}

export function MemberList({ members, onRevoke }: MemberListProps) {
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
                                        <ListTodo />
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
