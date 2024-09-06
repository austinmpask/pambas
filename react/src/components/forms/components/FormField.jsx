// import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Input } from "@nextui-org/react";
// import { Controller } from "react-hook-form";
// import Select from "react-select";

// //Default text input field to be used across application. Uses react-hook-form
// export default function FormField({
//   required = true,
//   field,
//   error,
//   label,
//   validations,
//   loading,
//   type = "text",
//   size = "ff-small",
//   placeHolder,
//   defaultValue,
//   control,
//   options,
// }) {
//   return (
//     <div className="w-[240px]">
//       {type === "dropdown" ? null : //       isDisabled={loading} //       inputRef={ref} //       value={value} //       onChange={onChange} //       options={options} //     <Select //   render={({ field: { onChange, value, ref } }) => ( //   rules={validations} //   defaultValue={defaultValue} //   control={control} //   name={field} // <Controller
//       //     />
//       //   )}
//       // />
//       type === "textarea" ? null : (
//         // <Controller
//         //   name={field}
//         //   control={control}
//         //   defaultValue={defaultValue}
//         //   rules={validations}
//         //   render={({ field: { onChange, value, ref } }) => (
//         //     <textarea
//         //       className={`input area-input ${error ? "is-danger" : ""}`}
//         //       onChange={onChange}
//         //       value={value}
//         //       ref={ref}
//         //       disabled={loading}
//         //       placeholder={placeHolder || ""}
//         //     />
//         //   )}
//         // />
//         <Controller
//           name={field}
//           control={control}
//           rules={validations}
//           render={({ field: { onChange, value, ref } }) => (
//             <Input
//               type={type}
//               isRequired={required}
//               isInvalid={!!error}
//               errorMessage={error}
//               className="max-w-xs mb-3"
//               label={label}
//               onChange={onChange}
//               value={value}
//               ref={ref}
//               isDisabled={loading}
//               placeholder={placeHolder || ""}
//             />
//           )}
//         />
//       )}
//       {/* {error && (
//         <span className="icon is-small is-right">
//           <FontAwesomeIcon icon={faExclamationTriangle} color="red" />
//         </span>
//       )} */}
//     </div>
//   );
// }
