import { useUsers } from "../hooks/useUsers";
import { IUser } from "../interface/IUsers";

interface Props {
    userId: string | undefined;
    isOpen: boolean;
    onClose: () => void;
}

export default function DeleteModal({ userId, isOpen, onClose }: Props) {
    const { handleDeleteUser } = useUsers()

    if (!isOpen) return null;

    console.log("Users", userId)

    const handleDelete = async () => {
        if (!userId) return
        await handleDeleteUser(userId)
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-fit max-w-2xl h-[300px] flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Tem certeza que deseja excluir esse usuário?
                    </h2>
                </div>
                <div className="flex justify-center gap-16 mt-4 py-6">
                    <button className="bg-[var(--color-theadColor)] font-medium px-17 py-2 rounded" onClick={onClose}>Não</button>
                    <button className="bg-blue-600 text-white px-17 py-2 rounded" onClick={handleDelete}>Sim</button>
                </div>
            </div>

        </div>
    )
}