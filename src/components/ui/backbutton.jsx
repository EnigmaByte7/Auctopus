import Link from "next/link"

export default function backbutton() {
  return (
    <Link href={'/browse'}><button className="btn btn-circle absolute top-5 left-10 border-1">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="30"
                viewBox="0 0 1024 1024"
            ><g id="SVGRepo_iconCarrier"><path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64"></path><path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312z"></path></g>
            </svg>        
        </button>
    </Link>
  )
}
