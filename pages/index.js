import Head from "next/head";
import { MongoClient } from "mongodb";
//import Layout from "../components/layout/Layout";
import MeetupList from "../components/meetups/MeetupList";
import { Fragment } from "react";

// domain.com/

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title> React Meetups</title>
        <meta
          name='description'
          content='Browse a huge list of highly active React meetups'
        />
      </Head>
      <MeetupList meetups={props.meetups} />; ;
    </Fragment>
  );
}

// // SSR if you have data that revalidate frequently
// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;
//   // fetch data from an API
//   return {
//     props: { meetups: DUMMY_MEETUPS },
//   };
// }

//Get Static Props if you dont need the site refreshed or validated all the time
export async function getStaticProps() {
  // fetch data from an API

  const client = await MongoClient.connect(
    "mongodb+srv://admin1:3516710@cluster0.q8ntd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();
  client.close();

  return {
    props: {
      meetups: meetups.map(meetup => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10,
  };
}

export default HomePage;
