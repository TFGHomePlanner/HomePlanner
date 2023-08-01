import React from "react";
import {trpc} from "../../server/utils/trpc";

function OpenList({idProdcut, name, isPurchase} : {idProdcut: string, name: string, isPurchase: boolean}){
  
  const 
  const {mutate} = trpc.list.updateProduct.useMutation({
    onSuccess: (output) => {
      if (output.success) {
        console.log("Product updated");
      } 
    },
    onError: (error) => {
      console.log("Error during the update:", error);
    },
  });
  
  
  
  return (
    <View className="flex flex-row justify-between items-center">
    </View>
   
  );
}
export default OpenList;
    