import { trpc } from "../app/server/utils/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import UserProvider from "../app/context/userContext";
import TabHomeScreen from "../app/screens/(tabs)/home";
import { httpBatchLink } from "@trpc/client";
import { create } from "react-test-renderer";

test("renders correctly", () => {
	const queryClient = new QueryClient();
	const trpcClient = trpc.createClient({
		links: [
			httpBatchLink({
				url: "http://192.168.1.38:4000/trpc",
			}),
		],
	});

	const tree = create(
		<QueryClientProvider client={queryClient}>
			<trpc.Provider client={trpcClient} queryClient={queryClient}>
				<UserProvider>
					<TabHomeScreen />
				</UserProvider>
			</trpc.Provider>
		</QueryClientProvider>
	)
		.toJSON();
	expect(tree).toMatchSnapshot();
});
