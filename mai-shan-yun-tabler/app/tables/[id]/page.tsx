import TableGrid from "@/components/TableGrid";

interface Params {
	params: { id: string };
}

export default function TableDetailPage(_props: Params) {
	// This dynamic page delegates to the same TableGrid used on /tables
	return <TableGrid />;
}
