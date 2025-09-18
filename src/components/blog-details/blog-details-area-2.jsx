'use client';
import React from 'react';
import Image from 'next/image';
import blogData from '@/data/blog-data';
import GridItem from '../blog/blog-grid/grid-item';
import BlogDetailsComments from './blog-details-comments';
import BlogPostCommentForm from '../forms/blog-post-comment-form';
import BlogDetailsAuthor from './blog-details-author';
import PostboxDetailsNav from './postbox-details-nav';
import PostboxDetailsTop from './postbox-details-top';
import social_data from '@/data/social-data';

// Use /public-based paths (no alias)
const IMG_LINE = '/assets/img/blog/details/shape/line.png';
const IMG_QUOTE = '/assets/img/blog/details/shape/quote.png';
const IMG_BIG = '/assets/img/blog/details/blog-big-1.jpg';
const IMG_SM = '/assets/img/blog/details/blog-details-sm-1.jpg';

// related_blogs
const related_blogs = blogData.filter(b => b.blog === 'blog-grid').slice(0, 3);

const BlogDetailsAreaTwo = ({ blog }) => {
  return (
    <>
      <section className="tp-postbox-details-area pb-120 pt-95">
        <div className="container">
          <div className="row">
            <div className="col-xl-9">
              <PostboxDetailsTop blog={blog} />
            </div>
            <div className="col-xl-12">
              <div className="tp-postbox-details-thumb">
                {/* When using string src (public/), provide width & height */}
                <Image src={IMG_BIG} alt="blog-big-img" width={1200} height={675} priority />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-2 col-lg-2 col-md-2">
              <div className="tp-postbox-details-share-2">
                <span>Share Now</span>
                <ul>
                  {social_data.map(s => (
                    <li key={s.id}>
                      <a href={s.link} target="_blank" className="me-1" rel="noreferrer">
                        <i className={s.icon}></i>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-xl-8 col-lg-8 col-md-10">
              <div className="tp-postbox-details-main-wrapper tp-postbox-style2">
                <div className="tp-postbox-details-content">
                  <p className="tp-dropcap">
                    sales process is critically important to the success of your reps and your business. If you have never seen a really skilled salesperson work, it seems almost effortless. They ask great questions, craftt perfect proposal, answer questions, address concerns and seamlessly seal the Underneath the surface of all of that, the salesperson has probably dedicated hours honing their craft and ensuring the process moves smoothly.
                  </p>

                  <p>
                    One of the challenges that often surfaces when  working with a remote sales team is a lack of transparency over what is happening, and where in the process things are taking place. We’re going to peel back the curtain and show you how to create the best sales.
                  </p>

                  <h4 className="tp-postbox-details-heading">Breaking Up With Fast Fashion Has Been Easier</h4>
                  <p>
                    Lommodo ligula eget dolor. Aenean massa. Cum sociis que penatibus magnis dis parturient montes lorem, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque euro, pretium, sem. Nulla onsequat massa quis enim. donec pede justo fringilla vel aliquet.
                  </p>

                  <div className="tp-postbox-details-desc-thumb text-center">
                    <Image src={IMG_SM} alt="details-sm-img" width={900} height={540} />
                    <span className="tp-postbox-details-desc-thumb-caption">
                      Gucci’s Women’s Cruise Collection 2023 Lookbook Has Arrived
                    </span>
                  </div>

                  <p>
                    “We’re so glad we’ll be working with you to get your new marketing strategy up and running. I have attached the details of your package. Next you’ll get an email from Jen to schedule your kick-off meeting and be assigned your account rep. During your kick-off meeting, we will introduce your project team, let you know what access we need to start.”
                  </p>

                  <div className="tp-postbox-details-quote">
                    <blockquote>
                      <div className="tp-postbox-details-quote-shape">
                        <Image
                          className="tp-postbox-details-quote-shape-1"
                          src={IMG_LINE}
                          alt="shape"
                          width={160}
                          height={12}
                        />
                        <Image
                          className="tp-postbox-details-quote-shape-2"
                          src={IMG_QUOTE}
                          alt="shape"
                          width={32}
                          height={32}
                        />
                      </div>
                      <p>
                        There is a way out of every box, a solution to every puzzle its just a matter of finding it.
                      </p>
                      <cite>Shahnewaz Sakil</cite>
                    </blockquote>
                  </div>

                  <h4 className="tp-postbox-details-heading">Exploring the English Countryside</h4>
                  <p>
                    Lorem ligula eget dolor. Aenean massa. Cum sociis que penatibus et magnis dis parturient montes lorem,nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque euro, pretium quis, sem. Nulla onsequat massa quis enim.
                  </p>

                  <div className="tp-postbox-details-list">
                    <ul>
                      <li>Lorem ipsum dolor sit amet.</li>
                      <li>At vero eos et accusamus et iusto odio.</li>
                      <li>Excepteur sint occaecat cupidatat non proident.</li>
                    </ul>
                  </div>

                  <p>
                    Rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer cidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae lorem.
                  </p>

                  <div className="tp-postbox-details-share-wrapper">
                    <div className="row">
                      <div className="col-xl-12">
                        <div className="tp-postbox-details-tags tagcloud">
                          <span>Tags:</span>
                          <a href="#">Lifesttyle</a>
                          <a href="#">Awesome</a>
                          <a href="#">Winter</a>
                          <a href="#">Sunglasses</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PostboxDetailsNav */}
                  <PostboxDetailsNav />
                  {/* author details */}
                  <BlogDetailsAuthor />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tp-postbox-related-area pt-115 pb-90 mb-110" style={{ backgroundColor: '#F4F7F9' }}>
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <div className="tp-postbox-related">
                  <h3 className="tp-postbox-related-title">Related Articles</h3>
                  <div className="row">
                    {related_blogs.map((b) => (
                      <div className="col-lg-4 col-md-6" key={b.id}>
                        <GridItem blog={b} style_2 />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="tp-postbox-details-comment-wrapper">
                <h3 className="tp-postbox-details-comment-title">Comments (2)</h3>
                <BlogDetailsComments />
              </div>

              <div className="tp-postbox-details-form">
                <h3 className="tp-postbox-details-form-title">Leave a Reply</h3>
                <p>Your email address will not be published. Required fields are marked *</p>
                <BlogPostCommentForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetailsAreaTwo;
