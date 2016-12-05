<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Entity\RecipeVoteRepository")
 * @ORM\Entity
 * @ORM\Table(name="blog_votes")
 */
class RecipeVote
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="Recipe", inversedBy="votes")
     * @ORM\JoinColumn(name="recipe_id", referencedColumnName="id")
     */
    protected $post;

    /**
     * @ORM\Column(type="string", columnDefinition="CHAR(2) NULL")
     */
    protected $user_vote;

    /**
     * @ORM\Column(type="string", length=10, nullable=true)
     */
    protected $client_id;

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set userVote
     *
     * @param string $userVote
     *
     * @return RecipeVote
     */
    public function setUserVote($userVote)
    {
        $this->user_vote = $userVote;

        return $this;
    }

    /**
     * Get userVote
     *
     * @return string
     */
    public function getUserVote()
    {
        return $this->user_vote;
    }

    /**
     * Set clientId
     *
     * @param string $clientId
     *
     * @return RecipeVote
     */
    public function setClientId($clientId)
    {
        $this->client_id = $clientId;

        return $this;
    }

    /**
     * Get clientId
     *
     * @return string
     */
    public function getClientId()
    {
        return $this->client_id;
    }

    /**
     * Set post
     *
     * @param \AppBundle\Entity\Recipe $post
     *
     * @return RecipeVote
     */
    public function setPost(\AppBundle\Entity\Recipe $post = null)
    {
        $this->post = $post;

        return $this;
    }

    /**
     * Get post
     *
     * @return \AppBundle\Entity\Recipe
     */
    public function getPost()
    {
        return $this->post;
    }
}
