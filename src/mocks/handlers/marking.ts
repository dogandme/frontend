import { http, HttpResponse, type PathParams } from "msw";
import { ERROR_MESSAGE } from "@/app/ReactQueryProvider/constants";
import { MARKING_END_POINT } from "@/features/marking/constants";
import { MARKER_END_POINT } from "@/entities/marking/constants";
import type {
  Marking,
  SortType,
  TempMarking,
} from "@/entities/marking/types/server";
import { API_BASE_URL } from "@/shared/constants";
import { createMockMarking, getMockMarkingList } from "../data/markingList";
import { _likedMarkingList, _savedMarkingList } from "../data/markingList";
import { getMyMark } from "../data/myMark";
import { profileMarkingThumbnail } from "../data/profileMarking";
import { temporaryMarkingList as _temporaryMarkingList } from "../data/tempMarkingList";
import { getMockUserMarkingList } from "../data/userMarkingList";

let likedMarkingList = [..._likedMarkingList];
let savedMarkingList = [..._savedMarkingList];

const getAddressFromLatLngHandler = http.get<PathParams>(
  `${API_BASE_URL}/maps/reverse-geocode`,
  async ({ request }) => {
    const requestUrl = new URL(request.url);
    const lat = requestUrl.searchParams.get("lat");
    const lng = requestUrl.searchParams.get("lng");

    if (!lat || !lng) {
      return HttpResponse.json(
        {
          code: 400,
          menubar: "위경도 값을 입력해 주세요",
        },
        {
          status: 400,
          statusText: "Bad Request",
        },
      );
    }

    return HttpResponse.json({
      code: 200,
      message: "success",
      content: {
        region: "서울특별시 강남구 역삼동 123-456",
      },
    });
  },
);

const postAddMarkingHandler = http.post<PathParams>(
  MARKING_END_POINT.ADD,
  async ({ request }) => {
    /**
     * 2024/10/07 access token에 대한 테스트 로직을 추가 합니다.
     */
    const token = request.headers.get("Authorization");

    if (!token?.startsWith("accessToken")) {
      return HttpResponse.json(
        {
          code: 401,
          message: ERROR_MESSAGE.ACCESS_TOKEN_INVALIDATED,
        },
        {
          status: 401,
        },
      );
    }

    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  },
);

const deleteMarkingHandler = http.delete<PathParams>(
  MARKING_END_POINT.DELETE,
  () => {
    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  },
);

const postLikeMarkingHandler = http.post<PathParams>(
  `${API_BASE_URL}/markings/likes/:markingId`,
  async ({ params }) => {
    await new Promise((res) => setTimeout(res, 1000));

    const markingId = Number(params.markingId);

    likedMarkingList.push(
      createMockMarking(
        markingId,
        {
          southBottomLat: 37.123456 + Math.random() * 0.1,
          northTopLat: 37.123456 + Math.random() * 0.1,
          southLeftLng: 127.123456 + Math.random() * 0.1,
          northRightLng: 127.123456 + Math.random() * 0.1,
        },
        `User${Math.floor(Math.random() * 100)}`,
      ),
    );

    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  },
);

const deleteLikeMarkingHandler = http.delete<PathParams>(
  `${API_BASE_URL}/markings/likes/:markingId`,
  async ({ params }) => {
    await new Promise((res) => setTimeout(res, 1000));

    const markingId = Number(params.markingId);

    likedMarkingList = likedMarkingList.filter(
      (marking) => marking.markingId !== markingId,
    );

    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  },
);

const postSaveMarkingHandler = http.post<PathParams>(
  `${API_BASE_URL}/markings/saves/:markingId`,
  async ({ params }) => {
    await new Promise((res) => setTimeout(res, 1000));

    const markingId = Number(params.markingId);
    savedMarkingList.push(
      createMockMarking(
        markingId,
        {
          southBottomLat: 37.123456 + Math.random() * 0.1,
          northTopLat: 37.123456 + Math.random() * 0.1,
          southLeftLng: 127.123456 + Math.random() * 0.1,
          northRightLng: 127.123456 + Math.random() * 0.1,
        },
        `User${Math.floor(Math.random() * 100)}`,
      ),
    );

    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  },
);

const deleteSaveMarkingHandler = http.delete<PathParams>(
  `${API_BASE_URL}/markings/saves/:markingId`,
  async ({ params }) => {
    await new Promise((res) => setTimeout(res, 1000));

    const markingId = Number(params.markingId);
    savedMarkingList = savedMarkingList.filter(
      (marking) => marking.markingId !== markingId,
    );

    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  },
);

const postAddTempMarkingHandler = http.post<PathParams>(
  MARKING_END_POINT.SAVE_TEMP,
  async ({ request }) => {
    /**
     * 2024/10/07 access token에 대한 테스트 로직을 추가 합니다.
     */
    const token = request.headers.get("Authorization");

    if (!token?.startsWith("accessToken")) {
      return HttpResponse.json(
        {
          code: 401,
          message: ERROR_MESSAGE.ACCESS_TOKEN_INVALIDATED,
        },
        {
          status: 401,
        },
      );
    }
    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  },
);

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

const getDistanceFromLatLonInKm = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) => {
  const R = 6371; // 지구 반지름 (Km)
  const dLat = deg2rad(lat2 - lat1); // 위도 차이
  const dLon = deg2rad(lng2 - lng1); // 경도 차이

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // 거리 (Km)

  return distance;
};

const markingListDB: Record<string, Marking[]> = {};

const getMarkingListHandler = http.get(
  `${API_BASE_URL}/markings/bounds`,
  async ({ request }) => {
    await new Promise((res) => setTimeout(res, 1000));
    const url = new URL(request.url);
    const token = request.headers.get("Authorization");

    if (token && token.startsWith("invalidAccessToken")) {
      return HttpResponse.json(
        {
          code: 401,
          message: ERROR_MESSAGE.ACCESS_TOKEN_INVALIDATED,
        },
        {
          status: 401,
        },
      );
    }

    const lat = Number(url.searchParams.get("lat"));
    const lng = Number(url.searchParams.get("lng"));
    const southBottomLat = Number(url.searchParams.get("southBottomLat"));
    const northTopLat = Number(url.searchParams.get("northTopLat"));
    const southLeftLng = Number(url.searchParams.get("southLeftLng"));
    const northRightLng = Number(url.searchParams.get("northRightLng"));

    const markingListDBKey = `${southBottomLat}-${northTopLat}-${southLeftLng}-${northRightLng}`;

    if (!markingListDB[markingListDBKey]) {
      markingListDB[markingListDBKey] = getMockMarkingList({
        southBottomLat,
        northTopLat,
        southLeftLng,
        northRightLng,
      });
    }

    const markingList = markingListDB[markingListDBKey];

    const sortType = url.searchParams.get("sortType") as SortType;

    if (sortType === "POPULARITY") {
      markingList.sort(
        (a, b) => b.countData.likedCount - a.countData.likedCount,
      );
    } else if (sortType === "RECENT") {
      markingList.sort(
        (a, b) => new Date(b.regDt).getTime() - new Date(a.regDt).getTime(),
      );
    } else if (sortType === "DISTANCE") {
      markingList.sort(
        (a, b) =>
          getDistanceFromLatLonInKm(lat, lng, a.lat, a.lng) -
          getDistanceFromLatLonInKm(lat, lng, b.lat, b.lng),
      );
    }

    const pageNumber = Number(url.searchParams.get("offset") || 0);
    const totalCount = markingList.length;
    const pageSize = 20;
    const lastPage = Math.ceil(totalCount / pageSize);

    // sort, paged, unpaged: 의미가 없는 데이터라 임의로 설정
    return HttpResponse.json({
      code: 200,
      message: "success",
      content: {
        markings: markingList.slice(
          pageNumber * pageSize,
          (pageNumber + 1) * pageSize,
        ),
        totalElements: totalCount,
        totalPages: lastPage,
        pageAble: {
          pageNumber,
          pageSize,
          sort: {
            sorted: false,
            unsorted: true,
            empty: true,
          },
          offset: pageNumber,
          paged: true,
          unpaged: false,
        },
      },
    });
  },
);

const getBoundaryMarkerListHandler = http.get(
  `${API_BASE_URL}/markings/marks`,
  async ({ request }) => {
    await new Promise((res) => setTimeout(res, 1000));
    const url = new URL(request.url);
    const token = request.headers.get("Authorization");

    if (token && token.startsWith("invalidAccessToken")) {
      return HttpResponse.json(
        {
          code: 401,
          message: ERROR_MESSAGE.ACCESS_TOKEN_INVALIDATED,
        },
        {
          status: 401,
        },
      );
    }

    const southBottomLat = Number(url.searchParams.get("southBottomLat"));
    const northTopLat = Number(url.searchParams.get("northTopLat"));
    const southLeftLng = Number(url.searchParams.get("southLeftLng"));
    const northRightLng = Number(url.searchParams.get("northRightLng"));

    const markingListDBKey = `${southBottomLat}-${northTopLat}-${southLeftLng}-${northRightLng}`;

    if (!markingListDB[markingListDBKey]) {
      markingListDB[markingListDBKey] = getMockMarkingList({
        southBottomLat,
        northTopLat,
        southLeftLng,
        northRightLng,
      });
    }

    const markingList = markingListDB[markingListDBKey];

    const markerList = markingList.map((marking) => ({
      markingId: marking.markingId,
      lat: marking.lat,
      lng: marking.lng,
      previewImage: marking.previewImage,
    }));

    return HttpResponse.json({
      code: 200,
      message: "success",
      content: markerList,
    });
  },
);

const getProfileThumbnailHandler = http.get(
  `${API_BASE_URL}/markings/marks/:nickname`,
  async ({ request, params }) => {
    const { nickname } = params;
    const token = request.headers.get("Authorization");

    if (!token?.startsWith("accessToken")) {
      return HttpResponse.json(
        {
          code: 401,
          message: ERROR_MESSAGE.ACCESS_TOKEN_INVALIDATED,
        },
        {
          status: 401,
        },
      );
    }

    if (profileMarkingThumbnail[nickname as string] === undefined) {
      return HttpResponse.json(
        {
          code: 404,
          message: "해당하는 유저를 찾을 수 없습니다.",
        },
        {
          status: 404,
        },
      );
    }

    const marks = profileMarkingThumbnail[nickname as string];

    const offset = Number(new URL(request.url).searchParams.get("offset"));
    const itemPerPage = 20;
    const start = offset * itemPerPage;
    const end = start + itemPerPage;

    return HttpResponse.json({
      code: 200,
      message: "success",
      content: {
        marks: marks.slice(start, end),
        totalElements: marks.length,
        totalPages: Math.ceil(marks.length / itemPerPage),
        pageAble: {
          pageNumber: offset,
          pageSize: itemPerPage,
          sort: {
            empty: true,
            unsorted: true,
            sorted: false,
          },
          offset: itemPerPage,
          unpaged: false,
          paged: true,
        },
      },
    });
  },
);

let temporaryMarkingList = [..._temporaryMarkingList];

const getTemporaryMarkingListHandler = http.get(
  `${API_BASE_URL}/markings/temps`,
  async ({ request }) => {
    await new Promise((res) => setTimeout(res, 1500));
    const url = new URL(request.url);

    const offset = Number(url.searchParams.get("offset")) || 0;
    const itemPerPage = 20;
    const start = offset * itemPerPage;
    const end = start + itemPerPage;
    const data = temporaryMarkingList.slice(start, end);

    return HttpResponse.json({
      code: 200,
      message: "success",
      content: {
        markings: data,
        totalElements: temporaryMarkingList.length,
        totalPages: Math.ceil(temporaryMarkingList.length / itemPerPage),
        pageAble: {
          pageNumber: offset,
          pageSize: itemPerPage,
          sort: {
            empty: true,
            unsorted: true,
            sorted: false,
          },
          offset,
          unpaged: false,
          paged: true,
        },
      },
    });
  },
);

const deleteTemporaryMarkingHandler = http.delete<
  PathParams,
  { id: TempMarking["markingId"] }
>(MARKING_END_POINT.DELETE_TEMPORARY_MARKING, async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000));
  const { id } = await request.json();

  const token = request.headers.get("Authorization");

  if (!token?.startsWith("accessToken")) {
    return HttpResponse.json(
      {
        code: 401,
        message: ERROR_MESSAGE.ACCESS_TOKEN_INVALIDATED,
      },
      {
        status: 401,
      },
    );
  }

  temporaryMarkingList = temporaryMarkingList.filter(
    (marking) => marking.markingId !== id,
  );

  return HttpResponse.json({
    code: 200,
    message: "success",
  });
});

const putModifyTempMarkingHandler = http.put(
  MARKING_END_POINT.PUT_MODIFY_TEMP_MARKING,
  async ({ request }) => {
    await new Promise((res) => setTimeout(res, 1000));
    const formData = await request.formData();
    const markingModifyDtoBlob = formData.get("markingModifyDto") as Blob;
    const markingModifyDtoText = await markingModifyDtoBlob.text();
    const { id, content, isVisible, removeIds, isTempSaved } =
      JSON.parse(markingModifyDtoText);
    const images = formData.getAll("images") as File[];
    const targetTempPost = temporaryMarkingList.find(
      (marking) => marking.markingId === id,
    );

    const token = request.headers.get("Authorization");

    if (!token?.startsWith("accessToken")) {
      return HttpResponse.json(
        {
          code: 401,
          message: ERROR_MESSAGE.ACCESS_TOKEN_INVALIDATED,
        },
        {
          status: 401,
        },
      );
    }

    if (!targetTempPost) {
      return HttpResponse.json(
        {
          code: 404,
          message: "해당하는 임시 마커를 찾을 수 없습니다.",
        },
        {
          status: 404,
        },
      );
    }

    if (isTempSaved) {
      targetTempPost.content = content;
      targetTempPost.isVisible = isVisible;
      targetTempPost.images = targetTempPost.images
        .filter(({ id }) => !removeIds.includes(id))
        .concat(
          images.map((image, idx) => ({
            id: idx,
            imageUrl: URL.createObjectURL(image),
            lank: idx,
            regDt: new Date().toISOString(),
          })),
        );
      targetTempPost.regDt = new Date().toISOString();

      temporaryMarkingList = temporaryMarkingList.map((marking) =>
        marking.markingId === id ? targetTempPost : marking,
      );

      return HttpResponse.json({
        code: 200,
        message: "success",
      });
    }

    profileMarkingThumbnail["뽀송송"].unshift({
      markingId: id,
      previewImage: `임시저장에서 저장 된 ${id}의 썸네일`,
      lat: Math.random() > 0.5 ? 35 + Math.random() : 35 - Math.random(),
      lng: Math.random() > 0.5 ? 129 + Math.random() : 129 - Math.random(),
    });

    temporaryMarkingList = temporaryMarkingList.filter(
      ({ markingId }) => markingId !== id,
    );

    return HttpResponse.json({
      code: 200,
      message: "success",
    });
  },
);

const { myMarkerList, myMarkingList } = getMyMark();

const getUserMarkingListHandler = http.get(
  `${API_BASE_URL}/markings/users/:nickname`,
  async ({ request, params }) => {
    await new Promise((res) => setTimeout(res, 1500));
    const { nickname } = params;

    if (typeof nickname !== "string") {
      return HttpResponse.json(
        {
          code: 400,
          message: "잘못된 요청입니다.",
        },
        {
          status: 400,
        },
      );
    }

    const url = new URL(request.url);

    const southBottomLat =
      Number(url.searchParams.get("southBottomLat")) || 37.56055534657849;
    const northTopLat =
      Number(url.searchParams.get("northTopLat")) || 37.572444179048894;
    const southLeftLng =
      Number(url.searchParams.get("southLeftLng")) || 126.98218424603498;
    const northRightLng =
      Number(url.searchParams.get("northRightLng")) || 126.97381575396503;

    // TODO 실제 서버에선  mapViewMode 가 ALL_VIEW 일 경우엔 사실 southBottomLat , ... 등의 queryParams가 존재하지 않습니다.
    // 쿼리 파라미터 값과 상관 없이 모든 데이터를 가져오기 때문입니다.
    // 하지만 우리는 가상 DB를 만들지 않고 랜덤한 마킹 리스트를 생성하기 때문에 해당 부분을 구현하는데 어려움이 있습니다.
    // 이에 임시 방편으로 mapViewMode여서 queryParams 가 없는 경우를 고려하여 기본 값을 넣어주도록 합니다.
    const markingList =
      nickname === "뽀송송"
        ? myMarkingList
        : getMockUserMarkingList({
            nickname,
            southBottomLat,
            northTopLat,
            southLeftLng,
            northRightLng,
          });

    const sortType = url.searchParams.get("sortType") as SortType;

    if (sortType === "POPULARITY") {
      markingList.sort(
        (a, b) => b.countData.likedCount - a.countData.likedCount,
      );
    } else if (sortType === "RECENT") {
      markingList.sort(
        (a, b) => new Date(b.regDt).getTime() - new Date(a.regDt).getTime(),
      );
    }

    if (sortType === "DISTANCE") {
      const lat = url.searchParams.get("lat");
      const lng = url.searchParams.get("lng");

      if (lat && lng) {
        markingList.sort(
          (a, b) =>
            getDistanceFromLatLonInKm(Number(lat), Number(lng), a.lat, a.lng) -
            getDistanceFromLatLonInKm(Number(lat), Number(lng), b.lat, b.lng),
        );
      }
    }

    const pageNumber = Number(url.searchParams.get("offset") || 0);
    const totalCount = markingList.length;
    const pageSize = 20;
    const lastPage = Math.ceil(totalCount / pageSize);

    return HttpResponse.json({
      code: 200,
      message: "success",
      content: {
        markings: markingList.slice(
          pageNumber * pageSize,
          (pageNumber + 1) * pageSize,
        ),
        totalElements: totalCount,
        totalPages: lastPage,
        pageAble: {
          pageNumber,
          pageSize,
          sort: {
            sorted: false,
            unsorted: true,
            empty: true,
          },
          offset: pageNumber,
          paged: true,
          unpaged: false,
        },
      },
    });
  },
);

const getMyMarkerList = http.get(MARKER_END_POINT.MY, ({ request }) => {
  const token = request.headers.get("Authorization");

  if (!token?.startsWith("accessToken")) {
    return HttpResponse.json(
      {
        code: 401,
        message: ERROR_MESSAGE.ACCESS_TOKEN_INVALIDATED,
      },
      {
        status: 401,
      },
    );
  }

  return HttpResponse.json({
    code: 200,
    message: "success",
    content: myMarkerList,
  });
});

const getLikedMarkerListHandler = http.get(
  `${API_BASE_URL}/markings/marks/likes`,
  async ({ request }) => {
    const token = request.headers.get("Authorization");

    if (!token?.startsWith("accessToken")) {
      return HttpResponse.json(
        {
          code: 401,
          message: ERROR_MESSAGE.ACCESS_TOKEN_INVALIDATED,
        },
        {
          status: 401,
        },
      );
    }

    return HttpResponse.json({
      code: 200,
      message: "success",
      content: likedMarkingList.map(
        ({ markingId, lat, lng, previewImage }) => ({
          markingId,
          lat,
          lng,
          previewImage,
        }),
      ),
    });
  },
);

const getLikedMarkingListHandler = http.get(
  `${API_BASE_URL}/markings/likes`,
  async ({ request }) => {
    const token = request.headers.get("Authorization");

    if (!token?.startsWith("accessToken")) {
      return HttpResponse.json(
        {
          code: 401,
          message: ERROR_MESSAGE.ACCESS_TOKEN_INVALIDATED,
        },
        {
          status: 401,
        },
      );
    }

    const pageNumber = Number(
      new URL(request.url).searchParams.get("offset") || 0,
    );
    const totalCount = likedMarkingList.length;
    const pageSize = 20;
    const lastPage = Math.ceil(totalCount / pageSize);

    return HttpResponse.json({
      code: 200,
      message: "success",
      content: {
        markings: likedMarkingList.slice(
          pageNumber * pageSize,
          (pageNumber + 1) * pageSize,
        ),
        totalElements: totalCount,
        totalPages: lastPage,
        pageAble: {
          pageNumber,
          pageSize,
          sort: {
            sorted: false,
            unsorted: true,
            empty: true,
          },
          offset: pageNumber,
          paged: true,
          unpaged: false,
        },
      },
    });
  },
);

const getSavedMarkingListHandler = http.get(
  `${API_BASE_URL}/markings/saves`,
  async ({ request }) => {
    const token = request.headers.get("Authorization");

    if (!token?.startsWith("accessToken")) {
      return HttpResponse.json(
        {
          code: 401,
          message: ERROR_MESSAGE.ACCESS_TOKEN_INVALIDATED,
        },
        {
          status: 401,
        },
      );
    }

    const pageNumber = Number(
      new URL(request.url).searchParams.get("offset") || 0,
    );
    const totalCount = savedMarkingList.length;
    const pageSize = 20;
    const lastPage = Math.ceil(totalCount / pageSize);

    return HttpResponse.json({
      code: 200,
      message: "success",
      content: {
        markings: savedMarkingList.slice(
          pageNumber * pageSize,
          (pageNumber + 1) * pageSize,
        ),
        totalElements: totalCount,
        totalPages: lastPage,
        pageAble: {
          pageNumber,
          pageSize,
          sort: {
            sorted: false,
            unsorted: true,
            empty: true,
          },
          offset: pageNumber,
          paged: true,
          unpaged: false,
        },
      },
    });
  },
);

const getSavedMarkerListHandler = http.get(
  `${API_BASE_URL}/markings/marks/saves`,
  async ({ request }) => {
    const token = request.headers.get("Authorization");

    if (!token?.startsWith("accessToken")) {
      return HttpResponse.json(
        {
          code: 401,
          message: ERROR_MESSAGE.ACCESS_TOKEN_INVALIDATED,
        },
        {
          status: 401,
        },
      );
    }

    return HttpResponse.json({
      code: 200,
      message: "success",
      content: savedMarkingList.map(
        ({ markingId, lat, lng, previewImage }) => ({
          markingId,
          lat,
          lng,
          previewImage,
        }),
      ),
    });
  },
);

const getMarkingDetailRequestHandler = http.get(
  `${API_BASE_URL}/markings/:markingId`,
  async ({ params }) => {
    const content = myMarkingList.find(
      ({ markingId }) => markingId === Number(params.markingId),
    );

    return HttpResponse.json({
      code: 200,
      message: "success",
      content:
        content ??
        createMockMarking(Number(params.markingId), {
          southBottomLat: 35.0,
          northTopLat: 35.1,
          southLeftLng: 129.0,
          northRightLng: 129.1,
        }),
    });
  },
);

export const markingHandlers = [
  getAddressFromLatLngHandler,
  postAddMarkingHandler,
  deleteMarkingHandler,
  postLikeMarkingHandler,
  deleteLikeMarkingHandler,
  postSaveMarkingHandler,
  deleteSaveMarkingHandler,
  postAddTempMarkingHandler,
  getMarkingListHandler,
  getBoundaryMarkerListHandler,
  getTemporaryMarkingListHandler,
  deleteTemporaryMarkingHandler,
  putModifyTempMarkingHandler,
  getUserMarkingListHandler,
  getMyMarkerList,
  getLikedMarkerListHandler,
  getSavedMarkerListHandler,
  getLikedMarkingListHandler,
  getSavedMarkingListHandler,
  getProfileThumbnailHandler,
  getMarkingDetailRequestHandler,
];
