'use client'
import { useCreateMeetingMutation, useMeetingJoinMutation } from '@/redux/api/meetingApi';
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
const cn = (...classes: string[]): string => {
    return classes.filter(Boolean).join(' ');
};
const MeetingJoin = () => {
     const user = useAppSelector((state) => state.auth.user);

     
    const [isCreating, setIsCreating] = useState(false);
    const [meetingId, setMeetingId] = useState('');
    const [password, setPassword] = useState('');
    const [createMeeting] = useCreateMeetingMutation();
    const [meetingJoin] = useMeetingJoinMutation();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);


    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (isCreating) {
            try {
                if (!user || !user._id) {
                    setError('User not authenticated or missing ID');
                    return;
                }

        const meetingData = {
            startTime: new Date(),
            password: password,
            hostId: user?._id, // 👈 add this
        };

        const response = await createMeeting(meetingData).unwrap();
        console.log('Meeting created:', response);
        router.push(`/meeting/${response.meetingId}`);
    } catch (err: any) {
        setError(err?.data?.message || 'Failed to create meeting');
        console.error('Failed to create meeting:', err);
    }
}
 else {
            try {
                const credentials = { meetingId, password };
                const response = await meetingJoin(credentials).unwrap();
                console.log('Joined meeting:', response);
                router.push(`/meeting/${response.meetingId}`);
            } catch (err: any) {
                setError(err.message || 'Failed to join meeting');
                console.error('Failed to join meeting:', err);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <h2 className="mb-6 text-2xl font-semibold text-center text-gray-900 dark:text-white">
                    {isCreating ? 'Create Meeting' : 'Join Meeting'}
                </h2>
                <form onSubmit={onSubmit} className="space-y-6">
                    {!isCreating && (
                        <div>
                            <label
                                htmlFor="meetingId"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Meeting ID
                            </label>
                            <input
                                id="meetingId"
                                type="text"
                                value={meetingId}
                                onChange={(e) => setMeetingId(e.target.value)}
                                placeholder="Enter Meeting ID"
                                required
                                className="mt-1 w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    )}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Password (Optional)
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            className="mt-1 w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    <button
                        type="submit"
                        className={cn(
                            'w-full py-3 text-white font-semibold rounded-md transition-colors',
                            isCreating
                                ? 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800'
                                : 'bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800',
                            'focus:outline-none focus:ring-2 focus:ring-opacity-50',
                            isCreating
                                ? 'focus:ring-blue-500 dark:focus:ring-blue-400'
                                : 'focus:ring-green-500 dark:focus:ring-green-400',
                        )}
                    >
                        {isCreating ? 'Create Meeting' : 'Join Meeting'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsCreating(!isCreating)}
                        className="w-full py-3 text-gray-700 dark:text-gray-300 font-semibold rounded-md transition-colors bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-opacity-50"
                    >
                        {isCreating ? 'Join an existing meeting' : 'Start a new meeting'}
                    </button>
                    {error && (
                        <p className="text-red-500 dark:text-red-400 text-sm">
                            {error}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default MeetingJoin;