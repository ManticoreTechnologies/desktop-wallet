import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Overview from "./pages/sidebar/overview/overview";
import Send from "./pages/sidebar/send/send";
import Receive from "./pages/sidebar/receive/receive";
import CreateAssets from "./pages/sidebar/createAssets/createAssets";
import RestrictedAssets from "./pages/sidebar/restrictedAssets/restrictedAssets";
import TransferAssets from "./pages/sidebar/transferAssets/transferAssets";
import ManageAssets from "./pages/sidebar/manageAssets/manageAssets";
import Transactions from "./pages/sidebar/transactions/transactions";
import Recover from "./pages/Recover/Recover";

import { useState } from 'react';

// Global CSS
import './pages/Global.css'
import Sidebar from "./components/Sidebar";

function App(): JSX.Element {
    const [isWalletCreated, setIsWalletCreated] = useState(false);

    if (!isWalletCreated) {
        return <Recover onWalletCreated={() => setIsWalletCreated(true)} />;
    }

    return (
        <Router>
            <Sidebar/>
            <Routes>
                
                <Route path="/" element={<Overview />} />

                <Route path="/overview" element={<Overview />} />
                <Route path="/send" element={<Send />} />
                <Route path="/receive" element={<Receive />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/createAssets" element={<CreateAssets />} />
                <Route path="/transferAssets" element={<TransferAssets />} />
                <Route path="/manageAssets" element={<ManageAssets />} />
                <Route path="/restrictedAssets" element={<RestrictedAssets />} />
            </Routes>
        </Router>
    );
}

export default App;