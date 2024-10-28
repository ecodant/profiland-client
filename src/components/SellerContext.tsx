import { Seller } from "@/lib/types";
import { createContext, ReactNode, useState } from "react";



interface DataContextType {
    data: Seller[] | null;
    updateData: (data: Seller[]) => void;
}


const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
    children: ReactNode;
}

export const SellerContext: React.FC<DataProviderProps> = ({ children }) => {
    const [data, setData] = useState<Seller[] | null>(null);

    const updateData = (newData: Seller[]): void => {
        setData(newData);
    };

    return (
        <DataContext.Provider value={{ data, updateData }}>
            {children}
        </DataContext.Provider>
    );
};

