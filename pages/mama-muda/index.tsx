import React, { useState } from "react";
import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Textarea,
  Badge,
} from "@chakra-ui/react";
import Layout from "../../components/Layout";
import { useQuery, useMutation, useQueryClient } from "react-query";
 
import { useForm } from "react-hook-form";
import MamaTable from "./MamaTable"

// import { dehydrate} from "react-query/hydration";

const getMessages = async () => {
  const URL = "http://localhost:3000/api/message";
  const result = await fetch(URL);
  return await result.json();
 
}

export type MessageProps = {
  id?: number;
  createdAt?: string;
  phoneNumber: number;
  message: string;
  status?: string;
}

export function formatDate(data: string | undefined) {
  return new Date(data).toLocaleString("id-ID");
}

const submitMessage = async (data: MessageProps) => {
  console.log('data', data);
  const URL = "http://localhost:3000/api/message/"
  const response = await fetch(URL, {
    method: "POST",
    body: JSON.stringify(data) 
  });

  if(!response.ok) {
    throw new Error("An error has occured");
  }

  return await response.json();
}

export default function MamaMuda() {
  const queryClient = useQueryClient();
  const { data, isSuccess } = useQuery("get-mama-muda", getMessages, {
    staleTime: 15000, // data yang didpatkan dari fetching (fresh) akan kadelwarsa setelah 5 detik
    refetchInterval: 15000, // akan melakukan fetch selang waktu 5 detik.
  });

  const {handleSubmit, errors, register, reset, clearErrors } = useForm<MessageProps>()
  const [errMessage, setErrMessage] = useState("");

  // Penggunaan useMutation sama dengan fetching data dengnan method POST
  // const mutation = useMutation(methodYangDijalankan, callback); 
  const mutation = useMutation(submitMessage, {
    onMutate: async (newMessage) => { 
      // data parameter newMessage didapatkan dari parameter function submitMessage  
      // ketika sedang prosses mutate (fetch method post)
      // use for: dalam flow ini, kita bisa menggunakan untuk disabled form, menampilkan loading kirim data ke user
      console.log('onMutate');

      // Optimistic Update:
      // 1. cancle any outgoing refetch (batalkan semua re-fetch)
      await queryClient.cancelQueries("get-mama-muda");
      // 2. snapshot the previous value (simpan data yang ada di cache saat ini)
       const previousMessages = queryClient.getQueryData<MessageProps[]>("get-mama-muda")
      // 3. optimistically update new value 
      if(previousMessages) {
        newMessage = {...newMessage, createdAt: new Date().toISOString()}
        const finalMessages = [...previousMessages, newMessage];
        queryClient.setQueryData("get-mama-muda", finalMessages);
      }

      console.log('previousMessages', previousMessages);
      return { previousMessages };

    },
    onSettled: async (data: any, error: any) => { 
      // ketika proses mutate (fetch method post) sudah selesai
      // ada 2 kemungkinan hasil yang di dapatkan dari response server: success & error
      console.log('onSettled');
      console.log(data);
      if(data) {
        // coba inlnvalideQueries
        // fungsi dari inlnvalideQueries agar, query yang di invalidate di re-fetch.   
        await queryClient.invalidateQueries("get-mama-muda")
        // clean up form
        setErrMessage("");
        // clearErrors & reset state form, from react-hooks-form.
        reset();
        clearErrors();
      } 

      if(error) {
        setErrMessage(error.message);
      }
    },
    onError: async (error: any, _variables, context: any) => {
      // data parameter context didapatkan dari return function onMutate, dalam hal ini  data parameter context di dapatkan dari data previousMessages. 
      // berjalan setelah proses mutate
      // khusus ketika terjadi error saat fetch ke server
      console.log('onError');

      // handle to allow Optimistic Update
      setErrMessage(error.message);
      if(context?.previousMessages) {
        queryClient.setQueryData<MessageProps[]>("get-mama-muda", context.previousMessages)
      }       
    },
    onSuccess: async () => { 
      // berjalan setelah proses mutate
      // khusus ketika response success setelah fetch ke server
      console.log('onSuccess');

    },
  })

  const onSubmit = async (data: MessageProps) => {
    await mutation.mutate(data)
  }

  return (
    <Layout title="💌 Mama Muda" subTitle="Minta Pulsa">
      <Flex>
        <Box>
          <Box
            w="md"
            p={5}
            mr={4}
            border="1px"
            borderColor="gray.200"
            boxShadow="md"
          >
            <Text
              fontSize="xl"
              fontWeight="bold"
              mb={4}
              pb={2}
              borderBottom="1px"
              borderColor="gray.200"
            >
              ✍️ Request Pulsa
            </Text>
            <form>
              <FormControl pb={4} isInvalid={errors.phoneNumber? true : false}>
                <FormLabel
                  htmlFor="phoneNumber"
                  fontWeight="bold"
                  fontSize="xs"
                  letterSpacing="1px"
                  textTransform="uppercase"
                >
                  Phone Number
                </FormLabel>
                <Input name="phoneNumber" placeholder="Phone Number" ref={
                  register({
                    required: "Phone Number Required"
                  })
                } />
                <FormErrorMessage>
                  { errors.phoneNumber && errors.phoneNumber.message }
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.message? true : false}>
                <FormLabel
                  htmlFor="name"
                  fontWeight="bold"
                  fontSize="xs"
                  letterSpacing="1px"
                  textTransform="uppercase"
                >
                  Message
                </FormLabel>
                <Textarea 
                  placeholder="Bullshit Message" 
                  name="message"
                  ref={register({  
                    required: "message required"
                  })}
                />
                <FormErrorMessage>
                  {errors.message && errors.message.message}
                </FormErrorMessage>
              </FormControl>

              <Button mt={4} colorScheme="teal" type="submit" onClick={handleSubmit(onSubmit)}>
                Send
              </Button>
            </form>
          </Box>
        </Box>
        <Box flex="1">
          {isSuccess && <MamaTable data={data} />}
        </Box>
      </Flex>
    </Layout>
  );
}
