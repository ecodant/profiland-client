import { useContext } from "react";
import { ProductsContext, ProductsContextType } from "../context/context";

export const useProducts = (): ProductsContextType => {
    const context = useContext(ProductsContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductsProvider');
    }
    return context;
};