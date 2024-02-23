"use client";
import {TextField, IndexTable, LegacyCard, IndexFilters, useSetIndexFiltersMode, useIndexResourceState, Text, ChoiceList, RangeSlider, Badge, useBreakpoints, Button} from "@shopify/polaris";
import type {IndexFiltersProps, TabProps} from "@shopify/polaris";
import {useState, useCallback} from "react";
import ReactPaginate from "react-paginate";
import SimulateForm from "./components/SimulateForm";
import useSWR from "swr";
import {GetProducts, GetStaffMembers} from "@/http";
import {IProduct} from "@/http/interfaces";

export const IndexTableWithViewsSearchFilterSorting = () => {
  const {data: staffList, isLoading} = useSWR("getStaffmembers", () => GetStaffMembers(), {
    revalidateOnMount: true, // Fetch data on component mount
    revalidateOnFocus: true, // Don't fetch data when component gains focus
    revalidationInterval: 3600000, // Revalidate every hour
    shouldRetryOnError: false,
  });

  const {data: productList} = useSWR("getProducts", () => GetProducts(), {
    revalidateOnMount: true, // Fetch data on component mount
    revalidateOnFocus: true, // Don't fetch data when component gains focus
    revalidationInterval: 3600000, // Revalidate every hour
    shouldRetryOnError: false,
  });

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const [itemStrings, setItemStrings] = useState(["Included", "Not Included"]);
  const deleteView = (index: number) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
    setSelected(0);
  };

  const duplicateView = async (name: string) => {
    setItemStrings([...itemStrings, name]);
    setSelected(itemStrings.length);
    await sleep(1);
    return true;
  };

  const tabs: TabProps[] = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
            {
              type: "rename",
              onAction: () => {},
              onPrimaryAction: async (value: string): Promise<boolean> => {
                const newItemsStrings = tabs.map((item, idx) => {
                  if (idx === index) {
                    return value;
                  }
                  return item.content;
                });
                await sleep(1);
                setItemStrings(newItemsStrings);
                return true;
              },
            },
            {
              type: "duplicate",
              onPrimaryAction: async (value: string): Promise<boolean> => {
                await sleep(1);
                duplicateView(value);
                return true;
              },
            },
            {
              type: "edit",
            },
            {
              type: "delete",
              onPrimaryAction: async () => {
                await sleep(1);
                deleteView(index);
                return true;
              },
            },
          ],
  }));

  const [selected, setSelected] = useState(0);
  const onCreateNewView = async (value: string) => {
    await sleep(500);
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  };
  const sortOptions: IndexFiltersProps["sortOptions"] = [
    {label: "Order", value: "order asc", directionLabel: "Ascending"},
    {label: "Order", value: "order desc", directionLabel: "Descending"},
    {label: "Customer", value: "customer asc", directionLabel: "A-Z"},
    {label: "Customer", value: "customer desc", directionLabel: "Z-A"},
    {label: "Date", value: "date asc", directionLabel: "A-Z"},
    {label: "Date", value: "date desc", directionLabel: "Z-A"},
    {label: "Total", value: "total asc", directionLabel: "Ascending"},
    {label: "Total", value: "total desc", directionLabel: "Descending"},
  ];
  const [sortSelected, setSortSelected] = useState(["order asc"]);
  const {mode, setMode} = useSetIndexFiltersMode();
  const onHandleCancel = () => {};

  const onHandleSave = async () => {
    await sleep(1);
    return true;
  };

  const primaryAction: IndexFiltersProps["primaryAction"] =
    selected === 0
      ? {
          type: "save-as",
          onAction: onCreateNewView,
          disabled: false,
          loading: false,
        }
      : {
          type: "save",
          onAction: onHandleSave,
          disabled: false,
          loading: false,
        };
  const [accountStatus, setAccountStatus] = useState<string[] | undefined>(undefined);
  const [moneySpent, setMoneySpent] = useState<[number, number] | undefined>(undefined);
  const [taggedWith, setTaggedWith] = useState("");
  const [queryValue, setQueryValue] = useState("");

  const handleAccountStatusChange = useCallback((value: string[]) => setAccountStatus(value), []);
  const handleMoneySpentChange = useCallback((value: [number, number]) => setMoneySpent(value), []);
  const handleTaggedWithChange = useCallback((value: string) => setTaggedWith(value), []);
  const handleFiltersQueryChange = useCallback((value: string) => setQueryValue(value), []);
  const handleAccountStatusRemove = useCallback(() => setAccountStatus(undefined), []);
  const handleMoneySpentRemove = useCallback(() => setMoneySpent(undefined), []);
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(""), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
  const handleFiltersClearAll = useCallback(() => {
    handleAccountStatusRemove();
    handleMoneySpentRemove();
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [handleAccountStatusRemove, handleMoneySpentRemove, handleQueryValueRemove, handleTaggedWithRemove]);

  const filters = [
    {
      key: "accountStatus",
      label: "Account status",
      filter: (
        <ChoiceList
          title="Account status"
          titleHidden
          choices={[
            {label: "Enabled", value: "enabled"},
            {label: "Not invited", value: "not invited"},
            {label: "Invited", value: "invited"},
            {label: "Declined", value: "declined"},
          ]}
          selected={accountStatus || []}
          onChange={handleAccountStatusChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "taggedWith",
      label: "Tagged with",
      filter: <TextField label="Tagged with" value={taggedWith} onChange={handleTaggedWithChange} autoComplete="off" labelHidden />,
      shortcut: true,
    },
    {
      key: "moneySpent",
      label: "Money spent",
      filter: <RangeSlider label="Money spent is between" labelHidden value={moneySpent || [0, 500]} prefix="$" output min={0} max={2000} step={1} onChange={handleMoneySpentChange} />,
    },
  ];

  const appliedFilters: IndexFiltersProps["appliedFilters"] = [];
  if (accountStatus && !isEmpty(accountStatus)) {
    const key = "accountStatus";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, accountStatus),
      onRemove: handleAccountStatusRemove,
    });
  }
  if (moneySpent) {
    const key = "moneySpent";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, moneySpent),
      onRemove: handleMoneySpentRemove,
    });
  }
  if (!isEmpty(taggedWith)) {
    const key = "taggedWith";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, taggedWith),
      onRemove: handleTaggedWithRemove,
    });
  }

  const orders = [
    {
      id: 2,
      name: (
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          Product name
        </Text>
      ),
      category: "Jul 20 at 4:34pm",
      price: "Jaydon Stanton",
      commission: "$969.44",
    },
  ];

  const resourceName = {
    singular: "order",
    plural: "orders",
  };

  const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState(orders);

  const ordersRow = orders.map(({id, name, category, price, commission}, index) => (
    <IndexTable.Row id={`${id}`} key={index} selected={selectedResources.includes(`${id}`)} position={index}>
      {/* <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          {id}
        </Text>
      </IndexTable.Cell> */}
      <IndexTable.Cell>{name}</IndexTable.Cell>
      <IndexTable.Cell>{category}</IndexTable.Cell>
      <IndexTable.Cell>${price}</IndexTable.Cell>

      <IndexTable.Cell>{commission}</IndexTable.Cell>
    </IndexTable.Row>
  ));

  const [commissionFieldValue, setCommissionFieldValue] = useState("0.0");
  const [selectValue, setSelectValue] = useState("kg");

  const handleCommissionFieldChange = useCallback((value: string) => setCommissionFieldValue(value), []);

  const handleSelectChange = useCallback((value: string) => setSelectValue(value), []);

  const [pageNumber, setPageNumber] = useState(0);
  const ItemPerPage = 5;
  const paginanteData = productList && productList.data;
  const pagesVisited = pageNumber * ItemPerPage;
  const currentPosts = paginanteData?.slice(pagesVisited, pagesVisited + ItemPerPage);
  const pageCount = Math.ceil(paginanteData?.length / ItemPerPage);

  const changePage = ({selected}: any) => {
    setPageNumber(selected);
  };

  const productsRow = currentPosts?.map(({name, category, commission, price, _id}: IProduct, index: number) => (
    <IndexTable.Row id={`${_id}`} key={index} selected={selectedResources.includes(`${_id}`)} position={index}>
      {/* <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          {id}
        </Text>
      </IndexTable.Cell> */}
      <IndexTable.Cell>{name}</IndexTable.Cell>
      <IndexTable.Cell>{category}</IndexTable.Cell>
      <IndexTable.Cell>${price}</IndexTable.Cell>

      <IndexTable.Cell>
        <div className="flex items-center gap-1">
        <span className="bg-gray p-1">%</span><input type="text" className="p-1 bg-white border-black rounded border-[1px]"/>
        </div>

      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  //handle pagination

  return (
    <div className="relative pb-10">
      <SimulateForm staffList={staffList && staffList.data} />
      {/* <div className="mt-5">
                <p className="pb-4 text-2xl font-bold">Orders</p>

        <LegacyCard>
          <IndexFilters
            sortOptions={sortOptions}
            sortSelected={sortSelected}
            queryValue={queryValue}
            queryPlaceholder="Searching in all"
            onQueryChange={handleFiltersQueryChange}
            onQueryClear={() => setQueryValue("")}
            onSort={setSortSelected}
            primaryAction={primaryAction}
            cancelAction={{
              onAction: onHandleCancel,
              disabled: false,
              loading: false,
            }}
            tabs={tabs}
            selected={selected}
            onSelect={setSelected}
            canCreateNewView
            onCreateNewView={onCreateNewView}
            filters={filters}
            appliedFilters={appliedFilters}
            onClearAll={handleFiltersClearAll}
            mode={mode}
            setMode={setMode}
          />
          <IndexTable condensed={useBreakpoints().smDown} itemCount={orders.length} selectedItemsCount={allResourcesSelected ? "All" : selectedResources.length} onSelectionChange={handleSelectionChange} headings={[{title: "Product Name"}, {title: "Category"}, {title: "Price"}, {title: "Commission"}]}>
            {ordersRow}
          </IndexTable>
        </LegacyCard>
      </div> */}

      <div className="h-[0.2px] my-10 border border-gray-300 w-full"></div>

      <div className="">
        <p className="pb-4 text-2xl font-bold">Products</p>
        <LegacyCard>
          <IndexFilters
            sortOptions={sortOptions}
            sortSelected={sortSelected}
            queryValue={queryValue}
            queryPlaceholder="Searching in all"
            onQueryChange={handleFiltersQueryChange}
            onQueryClear={() => setQueryValue("")}
            onSort={setSortSelected}
            primaryAction={primaryAction}
            cancelAction={{
              onAction: onHandleCancel,
              disabled: false,
              loading: false,
            }}
            tabs={tabs}
            selected={selected}
            onSelect={setSelected}
            canCreateNewView
            onCreateNewView={onCreateNewView}
            filters={filters}
            appliedFilters={appliedFilters}
            onClearAll={handleFiltersClearAll}
            mode={mode}
            setMode={setMode}
          />
          <IndexTable condensed={useBreakpoints().smDown} itemCount={orders.length} selectedItemsCount={allResourcesSelected ? "All" : selectedResources.length} onSelectionChange={handleSelectionChange} headings={[{title: "Product Name"}, {title: "Category"}, {title: "Price"}, {title: "Commission"}]}>
            {productsRow}
          </IndexTable>
          <div className="flex justify-center py-5">
            <ReactPaginate breakLabel="..." previousLabel="&larr;" nextLabel="&#8594;" pageCount={pageCount} onPageChange={changePage} containerClassName={"paginationBttns"} previousLinkClassName={"previousBttn"} nextLinkClassName={"nextBttn"} disabledClassName={"paginationDisabled"} activeClassName={"paginationActive"} />
          </div>
        </LegacyCard>
      </div>
    </div>
  );

  function disambiguateLabel(key: string, value: string | any[]): string {
    switch (key) {
      case "moneySpent":
        return `Money spent is between $${value[0]} and $${value[1]}`;
      case "taggedWith":
        return `Tagged with ${value}`;
      case "accountStatus":
        return (value as string[]).map((val) => `Customer ${val}`).join(", ");
      default:
        return value as string;
    }
  }

  function isEmpty(value: string | string[]): boolean {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
};

export default IndexTableWithViewsSearchFilterSorting;
