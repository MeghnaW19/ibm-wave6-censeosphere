package com.stackroute.review.service;

import com.stackroute.review.domain.Review;
import com.stackroute.review.dto.ReviewDTO;
import com.stackroute.review.repository.ReviewRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;


    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Value("${stackroute.rabbitmq.exchange}")
    private String exchange;

    @Value("${stackroute.rabbitmq.routingkeythree}")
    private String routingkeythree;

    @Autowired
    public ReviewServiceImpl(ReviewRepository reviewRepository)
    {
        this.reviewRepository=reviewRepository;
    }

    @Override
    public Review addReview(Review review) {

        //rabbitmq queue, exchange,routingkey generation
        Review savedReview = reviewRepository.save(review);
        ReviewDTO reviewDTO=new ReviewDTO(review.getProductName(),review.getReviewDescription());
        sendRating(reviewDTO);
        return savedReview;

    }

    @Override
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }


    @Override
    public void sendRating(ReviewDTO reviewDTO)
    {

        rabbitTemplate.convertAndSend(exchange, routingkeythree, reviewDTO);
        System.out.println("Send msg = " + reviewDTO.toString());

    }


}
