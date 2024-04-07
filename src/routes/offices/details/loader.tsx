import { queryOptions } from "@tanstack/react-query";
import { parse } from "valibot";

import { api } from "../../../lib/api";
import { OfficeSchema, type OfficeType } from "../../../types/Office";

type FetchOfficeDetailsOptions = {
	officeId: OfficeType["officeId"];
};

const fetchOfficeDetails = async ({ officeId }: FetchOfficeDetailsOptions) => {
	const data = await api.get(`/offices/${officeId}`);

	const office = parse(OfficeSchema, data.data);

	office.officePictures = office.officePictures.sort(
		(a, b) => a.pictureOrder - b.pictureOrder,
	);

	office.officeAmenities = office.officeAmenities.sort(
		(a, b) => a.amenityOrder - b.amenityOrder,
	);

	return office;
};

export const fetchOfficeDetailsQuery = ({
	officeId,
}: FetchOfficeDetailsOptions) =>
	queryOptions({
		queryKey: ["office", officeId],
		queryFn: () => fetchOfficeDetails({ officeId }),
	});
