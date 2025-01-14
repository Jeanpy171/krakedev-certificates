import Router from "./navigation/Router";
import Providers from "./provider/providers";

function App() {
  return (
    <Providers>
      <Router />
    </Providers>
  );
}

export default App;
