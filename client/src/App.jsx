import { Children } from "react";
import BankStatementUpload from "./upload.jsx"
function App({prop,children}) {

  return (
    <>   
    {children}
    {prop}
    <BankStatementUpload /> 
    </>);

}
export default App
